/**
 * Auth Controller
 * Handles authentication requests
 */

const authService = require('../services/authService');
const logger = require('../utils/logger');
const asyncHandler = require('../utils/asyncHandler');

// Cookie configuration for httpOnly JWT tokens
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  path: '/api'
};

const refreshCookieOptions = {
  ...cookieOptions,
  path: '/api/auth',
  maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
};

/**
 * Set httpOnly cookies for access and refresh tokens
 */
const setTokenCookies = (res, tokens) => {
  const accessMaxAge = parseJwtExpiry(tokens.expiresIn);
  res.cookie('accessToken', tokens.accessToken, {
    ...cookieOptions,
    maxAge: accessMaxAge
  });
  res.cookie('refreshToken', tokens.refreshToken, refreshCookieOptions);
};

/**
 * Parse JWT expiry string (e.g., '7d', '30d') to milliseconds
 */
const parseJwtExpiry = (expiresIn) => {
  if (!expiresIn) return 7 * 24 * 60 * 60 * 1000;
  const match = expiresIn.match(/^(\d+)([dhms])$/);
  if (!match) return 7 * 24 * 60 * 60 * 1000;
  const num = parseInt(match[1]);
  const unit = match[2];
  const multipliers = { d: 86400000, h: 3600000, m: 60000, s: 1000 };
  return num * (multipliers[unit] || 86400000);
};

/**
 * Register new user
 * POST /api/auth/register
 */
const register = asyncHandler(async (req, res) => {
  const { email, password, firstName, lastName, phone, country } = req.body;

  const result = await authService.register({
    email,
    password,
    firstName,
    lastName,
    phone,
    country
  });

  // Set httpOnly cookies
  setTokenCookies(res, result.tokens);

  res.status(201).json({
    success: true,
    message: 'Registration successful',
    data: {
      user: result.user
    }
  });
});

/**
 * Login user
 * POST /api/auth/login
 */
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const ipAddress = req.ip || req.connection.remoteAddress;

  const result = await authService.login(email, password, ipAddress);

  // Set httpOnly cookies
  setTokenCookies(res, result.tokens);

  res.json({
    success: true,
    message: 'Login successful',
    data: {
      user: result.user
    }
  });
});

/**
 * Logout user
 * POST /api/auth/logout
 */
const logout = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken;
  const userId = req.user.userId;

  await authService.logout(userId, refreshToken);

  // Clear httpOnly cookies (match paths used when setting)
  res.clearCookie('accessToken', { ...cookieOptions, path: '/api' });
  res.clearCookie('refreshToken', { ...cookieOptions, path: '/api/auth' });

  res.json({
    success: true,
    message: 'Logout successful'
  });
});

/**
 * Refresh token
 * POST /api/auth/refresh
 */
const refreshToken = asyncHandler(async (req, res) => {
  const token = req.cookies?.refreshToken || req.body?.refreshToken;

  if (!token) {
    return res.status(401).json({
      success: false,
      error: {
        code: 'NO_REFRESH_TOKEN',
        message: 'Refresh token required'
      }
    });
  }

  const tokens = await authService.refreshToken(token);

  // Set new httpOnly cookies
  setTokenCookies(res, tokens);

  res.json({
    success: true,
    data: { message: 'Token refreshed' }
  });
});

/**
 * Request password reset
 * POST /api/auth/forgot-password
 */
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  await authService.requestPasswordReset(email);

  // Always return success — don't reveal if email exists
  res.json({
    success: true,
    message: 'If an account exists with this email, a password reset link has been sent'
  });
});

/**
 * Reset password
 * POST /api/auth/reset-password
 */
const resetPassword = asyncHandler(async (req, res) => {
  const { token, password } = req.body;

  await authService.resetPassword(token, password);

  res.json({
    success: true,
    message: 'Password reset successful'
  });
});

/**
 * Verify email
 * GET /api/auth/verify-email/:token
 */
const verifyEmail = asyncHandler(async (req, res) => {
  const { token } = req.params;

  await authService.verifyEmail(token);

  res.json({
    success: true,
    message: 'Email verified successfully'
  });
});

/**
 * Get current user
 * GET /api/auth/me
 */
const getCurrentUser = asyncHandler(async (req, res) => {
  const userId = req.user.userId;

  const user = await authService.getUserById(userId);

  res.json({
    success: true,
    data: user
  });
});

/**
 * Update profile
 * PUT /api/auth/profile
 */
const updateProfile = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const updateData = req.body;

  const user = await authService.updateProfile(userId, updateData);

  res.json({
    success: true,
    message: 'Profile updated successfully',
    data: user
  });
});

/**
 * Change password
 * POST /api/auth/change-password
 */
const changePassword = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const { currentPassword, newPassword } = req.body;

  await authService.changePassword(userId, currentPassword, newPassword);

  res.json({
    success: true,
    message: 'Password changed successfully'
  });
});

module.exports = {
  register,
  login,
  logout,
  refreshToken,
  forgotPassword,
  resetPassword,
  verifyEmail,
  getCurrentUser,
  updateProfile,
  changePassword
};
