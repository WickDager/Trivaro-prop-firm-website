/**
 * User Controller
 * Handles user-related requests
 */

const authService = require('../services/authService');
const challengeService = require('../services/challengeService');
const logger = require('../utils/logger');
const asyncHandler = require('../utils/asyncHandler');

/**
 * Get user profile
 * GET /api/users/me
 */
const getProfile = asyncHandler(async (req, res) => {
  const userId = req.user.userId;

  const user = await authService.getUserById(userId);

  res.json({
    success: true,
    data: user
  });
});

/**
 * Update user profile
 * PUT /api/users/me
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
 * Get user challenges
 * GET /api/users/me/challenges
 */
const getUserChallenges = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const { status } = req.query;

  const challenges = await challengeService.getUserChallenges(userId, status);

  res.json({
    success: true,
    data: challenges
  });
});

/**
 * Get dashboard data
 * GET /api/users/me/dashboard
 */
const getDashboard = asyncHandler(async (req, res) => {
  const userId = req.user.userId;

  // Get user challenges
  const challenges = await challengeService.getUserChallenges(userId);

  // Calculate summary
  const summary = {
    totalChallenges: challenges.length,
    activeChallenges: challenges.filter(c => c.status === 'active').length,
    passedChallenges: challenges.filter(c => c.status === 'passed').length,
    failedChallenges: challenges.filter(c => c.status === 'failed').length,
    totalInvested: challenges.reduce((sum, c) => sum + c.accountSize, 0)
  };

  res.json({
    success: true,
    data: {
      summary,
      recentChallenges: challenges.slice(0, 5)
    }
  });
});

module.exports = {
  getProfile,
  updateProfile,
  getUserChallenges,
  getDashboard
};
