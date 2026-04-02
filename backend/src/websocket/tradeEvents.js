/**
 * Trade Events WebSocket Handler
 * Emits real-time trade updates
 */

const { emitToUser, emitToChallenge } = require('./socketServer');
const logger = require('../utils/logger');

/**
 * Emit trade update to user
 * @param {String} userId - User ID
 * @param {Object} tradeData - Trade data
 */
const emitTradeUpdate = (userId, tradeData) => {
  try {
    emitToUser(userId, 'trade:update', tradeData);
    logger.debug(`Trade update emitted to user ${userId}`);
  } catch (error) {
    logger.error('Failed to emit trade update:', error);
  }
};

/**
 * Emit equity update to user
 * @param {String} userId - User ID
 * @param {Object} equityData - Equity data
 */
const emitEquityUpdate = (userId, equityData) => {
  try {
    emitToUser(userId, 'equity:update', equityData);
  } catch (error) {
    logger.error('Failed to emit equity update:', error);
  }
};

/**
 * Emit rule violation alert
 * @param {String} userId - User ID
 * @param {Object} violationData - Violation data
 */
const emitRuleViolation = (userId, violationData) => {
  try {
    emitToUser(userId, 'rule:violation', violationData);
  } catch (error) {
    logger.error('Failed to emit rule violation:', error);
  }
};

/**
 * Emit phase completion notification
 * @param {String} userId - User ID
 * @param {Object} completionData - Completion data
 */
const emitPhaseCompletion = (userId, completionData) => {
  try {
    emitToUser(userId, 'phase:completed', completionData);
  } catch (error) {
    logger.error('Failed to emit phase completion:', error);
  }
};

module.exports = {
  emitTradeUpdate,
  emitEquityUpdate,
  emitRuleViolation,
  emitPhaseCompletion
};
