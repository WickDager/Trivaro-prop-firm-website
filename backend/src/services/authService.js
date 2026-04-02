/**
 * Auth Service
 * Authentication and authorization logic
 */

const User = require('../models/User');
const jwt = require('../config/jwt');
const encryptionService = require('./encryptionService');
const logger = require('../utils/logger');
const redisClient = require('../config/redis');

class AuthService {
  /**
   * Register a new user
   * @param {Object} userData - User registration data
   * @returns {Object} User and tokens
   */
  async register(userData) {
    try {
      // Check if user already exists
      const existingUser = await User.findOne({ email: userData.email });
      if (existingUser) {
        throw new Error('Email already registered');
      }

      // Create user
      const user = new User({
        email: userData.email,
        passwordHash: userData.password,
        firstName: userData.firstName,
        lastName: userData.lastName,
        phone: userData.phone,
        country: userData.country
      });

      // Generate email verification token
      user.emailVerificationToken = encryptionService.generateToken();

      await user.save();

      // Generate tokens
      const tokens = this.generateTokens(user);

      logger.info(`User registered: ${user.email}`);

      return {
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          isEmailVerified: user.isEmailVerified
        },
        tokens
      };
    } catch (error) {
      logger.error('Registration failed:', error);
      throw error;
    }
  }

  /**
   * Login user
   * @param {String} email - User email
   * @param {String} password - User password
   * @param {String} ipAddress - User IP address for audit
   * @returns {Object} User and tokens
   */
  async login(email, password, ipAddress = '') {
    try {
      // Find user with password hash
      const user = await User.findOne({ email }).select('+passwordHash');
      if (!user) {
        throw new Error('Invalid email or password');
      }

      // Check if user is active
      if (!user.isActive) {
        throw new Error('Account is deactivated');
      }

      // Verify password
      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        throw new Error('Invalid email or password');
      }

      // Generate tokens
      const tokens = this.generateTokens(user);

      // Update last login
      user.lastLogin = new Date();
      await user.save();

      // Log audit
      const AuditLog = require('../models/AuditLog');
      await AuditLog.create({
        userId: user._id,
        action: 'login',
        description: `User logged in from ${ipAddress || 'unknown IP'}`,
        ipAddress,
        status: 'success'
      });

      logger.info(`User logged in: ${user.email}`);

      return {
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          isEmailVerified: user.isEmailVerified
        },
        tokens
      };
    } catch (error) {
      logger.error('Login failed:', error);
      throw error;
    }
  }

  /**
   * Logout user
   * @param {String} userId - User ID
   * @param {String} refreshToken - Refresh token to invalidate
   */
  async logout(userId, refreshToken) {
    try {
      // Add refresh token to blacklist
      const decoded = jwt.verifyRefreshToken(refreshToken);
      if (decoded && decoded.exp) {
        const ttl = decoded.exp - Math.floor(Date.now() / 1000);
        if (ttl > 0) {
          await redisClient.setex(`blacklist:${refreshToken}`, ttl, '1');
        }
      }

      logger.info(`User logged out: ${userId}`);
    } catch (error) {
      logger.error('Logout failed:', error);
    }
  }

  /**
   * Refresh access token
   * @param {String} refreshToken - Refresh token
   * @returns {Object} New tokens
   */
  async refreshToken(refreshToken) {
    try {
      // Check if token is blacklisted
      const isBlacklisted = await redisClient.exists(`blacklist:${refreshToken}`);
      if (isBlacklisted) {
        throw new Error('Token has been revoked');
      }

      // Verify refresh token
      const decoded = jwt.verifyRefreshToken(refreshToken);

      // Find user
      const user = await User.findById(decoded.userId);
      if (!user || !user.isActive) {
        throw new Error('User not found or inactive');
      }

      // Generate new tokens
      const tokens = this.generateTokens(user);

      return tokens;
    } catch (error) {
      logger.error('Token refresh failed:', error);
      throw new Error('Invalid refresh token');
    }
  }

  /**
   * Request password reset
   * @param {String} email - User email
   * @returns {String} Reset token
   */
  async requestPasswordReset(email) {
    try {
      const user = await User.findOne({ email });
      if (!user) {
        // Don't reveal if email exists
        return null;
      }

      // Generate reset token
      const resetToken = user.generateResetToken();
      await user.save();

      logger.info(`Password reset requested for: ${email}`);

      return resetToken;
    } catch (error) {
      logger.error('Password reset request failed:', error);
      throw error;
    }
  }

  /**
   * Reset password
   * @param {String} token - Reset token
   * @param {String} newPassword - New password
   * @returns {Boolean} Success
   */
  async resetPassword(token, newPassword) {
    try {
      const user = await User.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: { $gt: Date.now() }
      });

      if (!user) {
        throw new Error('Invalid or expired reset token');
      }

      // Update password
      user.passwordHash = newPassword;
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;
      await user.save();

      logger.info(`Password reset for: ${user.email}`);

      return true;
    } catch (error) {
      logger.error('Password reset failed:', error);
      throw error;
    }
  }

  /**
   * Change password
   * @param {String} userId - User ID
   * @param {String} currentPassword - Current password
   * @param {String} newPassword - New password
   * @returns {Boolean} Success
   */
  async changePassword(userId, currentPassword, newPassword) {
    try {
      const user = await User.findById(userId).select('+passwordHash');
      if (!user) {
        throw new Error('User not found');
      }

      // Verify current password
      const isValid = await user.comparePassword(currentPassword);
      if (!isValid) {
        throw new Error('Current password is incorrect');
      }

      // Update password
      user.passwordHash = newPassword;
      await user.save();

      logger.info(`Password changed for: ${user.email}`);

      return true;
    } catch (error) {
      logger.error('Password change failed:', error);
      throw error;
    }
  }

  /**
   * Verify email
   * @param {String} token - Email verification token
   * @returns {Boolean} Success
   */
  async verifyEmail(token) {
    try {
      const user = await User.findOne({ emailVerificationToken: token });
      if (!user) {
        throw new Error('Invalid verification token');
      }

      user.isEmailVerified = true;
      user.emailVerificationToken = undefined;
      await user.save();

      logger.info(`Email verified for: ${user.email}`);

      return true;
    } catch (error) {
      logger.error('Email verification failed:', error);
      throw error;
    }
  }

  /**
   * Generate JWT tokens
   * @param {Object} user - User object
   * @returns {Object} Access and refresh tokens
   */
  generateTokens(user) {
    const payload = {
      userId: user._id,
      email: user.email,
      role: user.role
    };

    const accessToken = jwt.generateAccessToken(payload);
    const refreshToken = jwt.generateRefreshToken(payload);

    return {
      accessToken,
      refreshToken,
      expiresIn: jwt.JWT_EXPIRE
    };
  }

  /**
   * Get user by ID
   * @param {String} userId - User ID
   * @returns {Object} User data
   */
  async getUserById(userId) {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    return {
      id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      country: user.country,
      role: user.role,
      isEmailVerified: user.isEmailVerified,
      kycStatus: user.kycStatus,
      createdAt: user.createdAt
    };
  }

  /**
   * Update user profile
   * @param {String} userId - User ID
   * @param {Object} updateData - Data to update
   * @returns {Object} Updated user
   */
  async updateProfile(userId, updateData) {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Update allowed fields
    if (updateData.firstName) user.firstName = updateData.firstName;
    if (updateData.lastName) user.lastName = updateData.lastName;
    if (updateData.phone) user.phone = updateData.phone;
    if (updateData.country) user.country = updateData.country;

    await user.save();

    return {
      id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      country: user.country
    };
  }
}

module.exports = new AuthService();
