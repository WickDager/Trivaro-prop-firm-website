/**
 * Auth Controller
 * Handles authentication requests
 */

const authService = require('../services/authService');
const logger = require('../utils/logger');
const asyncHandler = require('../utils/asyncHandler');

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

  res.status(201).json({
    success: true,
    message: 'Registration successful',
    data: result
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

  res.json({
    success: true,
    message: 'Login successful',
    data: result
  });
});

/**
 * Logout user
 * POST /api/auth/logout
 */
const logout = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;
  const userId = req.user.userId;

  await authService.logout(userId, refreshToken);

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
  const { refreshToken } = req.body;

  const tokens = await authService.refreshToken(refreshToken);

  res.json({
    success: true,
    data: tokens
  });
});

/**
 * Request password reset
 * POST /api/auth/forgot-password
 */
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const resetToken = await authService.requestPasswordReset(email);

  res.json({
    success: true,
    message: 'If an account exists with this email, a password reset link has been sent',
    data: { resetToken } // In production, don't return the token
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
