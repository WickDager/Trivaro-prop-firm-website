/**
 * Challenge Controller
 * Handles challenge-related requests
 */

const challengeService = require('../services/challengeService');
const ruleEngine = require('../services/ruleEngine');
const logger = require('../utils/logger');
const asyncHandler = require('../utils/asyncHandler');

/**
 * Purchase challenge
 * POST /api/challenges/purchase
 */
const purchaseChallenge = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const { accountSize, accountType, paymentMethod } = req.body;

  const result = await challengeService.purchaseChallenge(
    userId,
    accountSize,
    accountType,
    paymentMethod
  );

  res.status(201).json({
    success: true,
    message: 'Challenge purchase initiated',
    data: result
  });
});

/**
 * Get user challenges
 * GET /api/challenges
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
 * Get challenge details
 * GET /api/challenges/:id
 */
const getChallengeDetails = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.userId;

  const challenge = await challengeService.getChallengeDetails(id, userId);

  res.json({
    success: true,
    data: challenge
  });
});

/**
 * Get challenge trades
 * GET /api/challenges/:id/trades
 */
const getChallengeTrades = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { closedOnly } = req.query;

  const trades = await challengeService.getChallengeTrades(id, closedOnly === 'true');

  res.json({
    success: true,
    data: trades
  });
});

/**
 * Get challenge statistics
 * GET /api/challenges/:id/statistics
 */
const getChallengeStatistics = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const stats = await challengeService.getStatistics(id);

  res.json({
    success: true,
    data: stats
  });
});

/**
 * Get equity history
 * GET /api/challenges/:id/equity-history
 */
const getEquityHistory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { days } = req.query;

  const history = await challengeService.getEquityHistory(id, parseInt(days) || 30);

  res.json({
    success: true,
    data: history
  });
});

/**
 * Sync trades
 * POST /api/challenges/:id/sync
 */
const syncTrades = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const trades = await challengeService.syncTrades(id);

  res.json({
    success: true,
    data: { trades: trades.length }
  });
});

/**
 * Check rules manually (for testing)
 * POST /api/challenges/:id/check-rules
 */
const checkRules = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const result = await ruleEngine.checkAllRules(id);

  res.json({
    success: true,
    data: result
  });
});

/**
 * Advance to next phase (admin only)
 * POST /api/challenges/:id/advance-phase
 */
const advancePhase = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const challenge = await challengeService.advancePhase(id);

  res.json({
    success: true,
    message: `Advanced to phase ${challenge.phase}`,
    data: challenge
  });
});

/**
 * Delete challenge
 * DELETE /api/challenges/:id
 */
const deleteChallenge = asyncHandler(async (req, res) => {
  const { id } = req.params;

  await challengeService.deleteChallenge(id);

  res.json({
    success: true,
    message: 'Challenge deleted successfully'
  });
});

module.exports = {
  purchaseChallenge,
  getUserChallenges,
  getChallengeDetails,
  getChallengeTrades,
  getChallengeStatistics,
  getEquityHistory,
  syncTrades,
  checkRules,
  advancePhase,
  deleteChallenge
};
