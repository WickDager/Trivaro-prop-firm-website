/**
 * Challenge Service
 * Business logic for challenge management
 */

const Challenge = require('../models/Challenge');
const Trade = require('../models/Trade');
const Transaction = require('../models/Transaction');
const User = require('../models/User');
const brokerService = require('../config/broker');
const encryptionService = require('./encryptionService');
const notificationService = require('./notificationService');
const ruleEngine = require('./ruleEngine');
const logger = require('../utils/logger');

// Challenge pricing
const CHALLENGE_PRICES = {
  5000: 49,
  10000: 99,
  25000: 199,
  50000: 349,
  100000: 549
};

// Challenge parameters by phase
const CHALLENGE_PARAMS = {
  'balance-based': {
    1: {
      profitTargetPercent: 0.10, // 10%
      maxDrawdownPercent: 0.10, // 10%
      dailyDrawdownPercent: 0.05 // 5%
    },
    2: {
      profitTargetPercent: 0.05, // 5%
      maxDrawdownPercent: 0.10, // 10%
      dailyDrawdownPercent: 0.05 // 5%
    },
    3: {
      profitTargetPercent: 0, // No target
      maxDrawdownPercent: 0.10, // 10%
      dailyDrawdownPercent: 0.05 // 5%
    }
  },
  'equity-based': {
    1: {
      profitTargetPercent: 0.10, // 10%
      maxDrawdownPercent: 0.10, // 10%
      dailyDrawdownPercent: 0.05 // 5%
    },
    2: {
      profitTargetPercent: 0.05, // 5%
      maxDrawdownPercent: 0.10, // 10%
      dailyDrawdownPercent: 0.05 // 5%
    },
    3: {
      profitTargetPercent: 0, // No target
      maxDrawdownPercent: 0.10, // 10%
      dailyDrawdownPercent: 0.05 // 5%
    }
  }
};

class ChallengeService {
  /**
   * Purchase a new challenge
   * @param {String} userId - User ID
   * @param {Number} accountSize - Account size
   * @param {String} accountType - Account type
   * @param {String} paymentMethod - Payment method
   * @returns {Object} Created challenge
   */
  async purchaseChallenge(userId, accountSize, accountType, paymentMethod = 'stripe') {
    try {
      // Validate account size
      if (!CHALLENGE_PRICES[accountSize]) {
        throw new Error('Invalid account size');
      }

      // Validate account type
      if (!['balance-based', 'equity-based'].includes(accountType)) {
        throw new Error('Invalid account type');
      }

      // Get user
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      // Calculate price
      const price = CHALLENGE_PRICES[accountSize];

      // Get challenge parameters
      const params = CHALLENGE_PARAMS[accountType][1];
      const initialBalance = accountSize;
      const profitTarget = initialBalance * params.profitTargetPercent;
      const maxDrawdown = initialBalance * params.maxDrawdownPercent;
      const dailyDrawdownLimit = initialBalance * params.dailyDrawdownPercent;

      // Create challenge document (pending status)
      const challenge = new Challenge({
        userId,
        accountSize,
        accountType,
        phase: 1,
        status: 'pending',
        initialBalance,
        profitTarget,
        maxDrawdown,
        dailyDrawdownLimit,
        currentBalance: initialBalance,
        currentEquity: initialBalance,
        highestEquity: initialBalance,
        dailyStartEquity: initialBalance
      });

      await challenge.save();

      // Create transaction record
      const transaction = new Transaction({
        userId,
        challengeId: challenge._id,
        type: 'challenge_purchase',
        amount: price,
        currency: 'USD',
        paymentMethod,
        paymentStatus: 'pending',
        description: `Phase 1 Challenge - $${accountSize.toLocaleString()} ${accountType}`
      });

      await transaction.save();

      logger.info(`Challenge purchase initiated: User ${userId}, Account $${accountSize}`);

      return {
        challenge,
        transaction,
        price
      };
    } catch (error) {
      logger.error('Failed to purchase challenge:', error);
      throw error;
    }
  }

  /**
   * Complete challenge purchase after payment
   * @param {String} challengeId - Challenge ID
   * @param {String} paymentGatewayId - Payment gateway transaction ID
   */
  async completePurchase(challengeId, paymentGatewayId) {
    try {
      const challenge = await Challenge.findById(challengeId);
      if (!challenge) {
        throw new Error('Challenge not found');
      }

      // Update transaction
      await Transaction.findOneAndUpdate(
        { challengeId },
        {
          paymentStatus: 'completed',
          paymentGatewayId,
          processedAt: new Date()
        }
      );

      // Create demo account
      const credentials = await this.createTradingAccount(challenge);

      // Update challenge
      challenge.status = 'active';
      challenge.mt4Login = credentials.login;
      challenge.mt4Password = credentials.encryptedPassword;
      challenge.mt4Server = credentials.server;
      challenge.startDate = new Date();
      await challenge.save();

      // Send notification
      await notificationService.sendAccountCreated(
        challenge.userId.toString(),
        challenge,
        credentials
      );

      logger.info(`Challenge purchase completed: ${challengeId}`);

      return { challenge, credentials };
    } catch (error) {
      logger.error('Failed to complete challenge purchase:', error);
      throw error;
    }
  }

  /**
   * Create trading account via broker
   * @param {Object} challenge - Challenge document
   * @returns {Object} Account credentials
   */
  async createTradingAccount(challenge) {
    try {
      // Create demo account via broker service
      const credentials = await brokerService.createDemoAccount(
        challenge.userId.toString(),
        challenge.accountSize,
        challenge.accountType,
        challenge.phase
      );

      // Encrypt password
      const encryptedPassword = encryptionService.encrypt(credentials.password);

      return {
        login: credentials.login,
        password: credentials.password,
        encryptedPassword,
        server: credentials.server,
        platform: credentials.platform
      };
    } catch (error) {
      logger.error('Failed to create trading account:', error);
      throw error;
    }
  }

  /**
   * Get user challenges
   * @param {String} userId - User ID
   * @param {String} status - Filter by status (optional)
   * @returns {Array} Challenges
   */
  async getUserChallenges(userId, status = null) {
    const query = { userId };
    if (status) {
      query.status = status;
    }

    return await Challenge.find(query)
      .sort({ createdAt: -1 })
      .populate('userId', 'email firstName lastName');
  }

  /**
   * Get challenge details
   * @param {String} challengeId - Challenge ID
   * @param {String} userId - User ID (for verification)
   * @returns {Object} Challenge details
   */
  async getChallengeDetails(challengeId, userId = null) {
    const query = { _id: challengeId };
    
    // If userId provided, verify ownership
    if (userId) {
      query.userId = userId;
    }

    const challenge = await Challenge.findOne(query);
    if (!challenge) {
      throw new Error('Challenge not found');
    }

    // Get trade statistics
    const stats = await Trade.calculateStatistics(challengeId);

    return {
      ...challenge.toObject(),
      statistics: stats
    };
  }

  /**
   * Get challenge trades
   * @param {String} challengeId - Challenge ID
   * @param {Boolean} closedOnly - Only return closed trades
   * @returns {Array} Trades
   */
  async getChallengeTrades(challengeId, closedOnly = false) {
    const query = { challengeId };
    if (closedOnly) {
      query.isOpen = false;
    }

    return await Trade.find(query).sort({ openTime: -1 });
  }

  /**
   * Sync trades from broker
   * @param {String} challengeId - Challenge ID
   * @returns {Array} Synced trades
   */
  async syncTrades(challengeId) {
    try {
      const challenge = await Challenge.findById(challengeId);
      if (!challenge) {
        throw new Error('Challenge not found');
      }

      // Get trades from broker
      const brokerTrades = await brokerService.getOpenPositions(
        challengeId,
        challenge.mt4Login,
        challenge.mt4Password,
        challenge.mt4Server
      );

      // Update challenge trade count
      challenge.totalTrades = brokerTrades.length;
      await challenge.save();

      return brokerTrades;
    } catch (error) {
      logger.error('Failed to sync trades:', error);
      throw error;
    }
  }

  /**
   * Advance to next phase
   * @param {String} challengeId - Challenge ID
   * @returns {Object} Updated challenge
   */
  async advancePhase(challengeId) {
    try {
      const challenge = await Challenge.findById(challengeId);
      if (!challenge) {
        throw new Error('Challenge not found');
      }

      if (challenge.phase >= 3) {
        throw new Error('Challenge already at max phase');
      }

      const nextPhase = challenge.phase + 1;
      const params = CHALLENGE_PARAMS[challenge.accountType][nextPhase];

      // Update challenge for next phase
      challenge.phase = nextPhase;
      challenge.profitTarget = challenge.initialBalance * params.profitTargetPercent;
      challenge.maxDrawdown = challenge.initialBalance * params.maxDrawdownPercent;
      challenge.dailyDrawdownLimit = challenge.initialBalance * params.dailyDrawdownPercent;
      challenge.phaseCompletedAt = new Date();
      challenge.rulesViolated = [];
      challenge.violationDate = null;
      challenge.violationReason = null;
      challenge.deletionScheduledDate = null;

      // Reset for new phase
      challenge.tradingDays = 0;
      challenge.totalTrades = 0;
      challenge.winningTrades = 0;
      challenge.losingTrades = 0;

      if (nextPhase === 3) {
        challenge.status = 'active';
        challenge.fundedAt = new Date();
      } else {
        // Create new trading account for next phase
        const credentials = await this.createTradingAccount(challenge);
        challenge.mt4Login = credentials.login;
        challenge.mt4Password = credentials.encryptedPassword;
        challenge.mt4Server = credentials.server;
      }

      await challenge.save();

      // Send notification
      await notificationService.sendPhaseCompletion(challenge.userId.toString(), challenge);

      logger.info(`Challenge ${challengeId} advanced to phase ${nextPhase}`);

      return challenge;
    } catch (error) {
      logger.error('Failed to advance phase:', error);
      throw error;
    }
  }

  /**
   * Fail challenge
   * @param {String} challengeId - Challenge ID
   * @param {Array} violations - Rule violations
   */
  async failChallenge(challengeId, violations) {
    try {
      const challenge = await Challenge.findById(challengeId);
      if (!challenge) {
        throw new Error('Challenge not found');
      }

      challenge.status = 'failed';
      challenge.rulesViolated = violations.map(v => v.rule);
      challenge.violationDate = new Date();
      challenge.violationReason = violations.map(v => v.message).join('; ');
      challenge.deletionScheduledDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000); // 3 days
      await challenge.save();

      // Send notification
      await notificationService.sendRuleViolation(
        challenge.userId.toString(),
        challenge,
        violations
      );

      logger.warn(`Challenge ${challengeId} failed: ${violations.map(v => v.rule).join(', ')}`);

      return challenge;
    } catch (error) {
      logger.error('Failed to fail challenge:', error);
      throw error;
    }
  }

  /**
   * Delete challenge
   * @param {String} challengeId - Challenge ID
   */
  async deleteChallenge(challengeId) {
    try {
      const challenge = await Challenge.findById(challengeId);
      if (!challenge) {
        throw new Error('Challenge not found');
      }

      // Delete demo account from broker
      if (challenge.mt4Login) {
        await brokerService.deleteDemoAccount(challenge.mt4Login);
      }

      // Delete challenge
      await Challenge.findByIdAndDelete(challengeId);

      logger.info(`Challenge deleted: ${challengeId}`);
    } catch (error) {
      logger.error('Failed to delete challenge:', error);
      throw error;
    }
  }

  /**
   * Get equity history for chart
   * @param {String} challengeId - Challenge ID
   * @param {Number} days - Number of days to retrieve
   * @returns {Array} Equity data points
   */
  async getEquityHistory(challengeId, days = 30) {
    try {
      const challenge = await Challenge.findById(challengeId);
      if (!challenge) {
        throw new Error('Challenge not found');
      }

      // Get current account info
      const accountInfo = await brokerService.getAccountInfo(
        challengeId,
        challenge.mt4Login,
        challenge.mt4Password,
        challenge.mt4Server
      );

      // Generate historical data points (in production, this would come from database)
      const history = [];
      const now = new Date();
      const startDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

      // For now, return current state
      history.push({
        timestamp: now,
        equity: accountInfo.equity,
        balance: accountInfo.balance,
        drawdown: challenge.getDrawdownPercentage()
      });

      return history;
    } catch (error) {
      logger.error('Failed to get equity history:', error);
      return [];
    }
  }

  /**
   * Get challenge statistics
   * @param {String} challengeId - Challenge ID
   * @returns {Object} Statistics
   */
  async getStatistics(challengeId) {
    const challenge = await Challenge.findById(challengeId);
    if (!challenge) {
      throw new Error('Challenge not found');
    }

    const stats = await Trade.calculateStatistics(challengeId);

    return {
      ...stats,
      currentBalance: challenge.currentBalance,
      currentEquity: challenge.currentEquity,
      totalProfit: challenge.totalProfit,
      totalLoss: challenge.totalLoss,
      tradingDays: challenge.tradingDays,
      profitPercentage: challenge.getProfitPercentage(),
      drawdownPercentage: challenge.getDrawdownPercentage()
    };
  }
}

module.exports = new ChallengeService();
