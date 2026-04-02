/**
 * Rule Engine - Trading Rule Validation
 * CRITICAL FILE: Handles all trading rule checks
 */

const Challenge = require('../models/Challenge');
const Trade = require('../models/Trade');
const logger = require('../utils/logger');
const brokerService = require('../config/broker');

class RuleEngine {
  /**
   * Check all rules for a challenge
   * @param {String} challengeId - Challenge ID
   * @returns {Object} Validation result with violations
   */
  async checkAllRules(challengeId) {
    try {
      const challenge = await Challenge.findById(challengeId);
      if (!challenge || challenge.status !== 'active') {
        return { valid: true, violations: [] };
      }

      const violations = [];

      // Get current account info from broker
      let accountInfo;
      try {
        accountInfo = await brokerService.getAccountInfo(
          challenge._id.toString(),
          challenge.mt4Login,
          challenge.mt4Password,
          challenge.mt4Server
        );
      } catch (error) {
        logger.error(`Failed to get account info for challenge ${challengeId}:`, error);
        // Use cached values if broker connection fails
        accountInfo = {
          balance: challenge.currentBalance,
          equity: challenge.currentEquity,
          floatingPL: 0
        };
      }

      // Update challenge with latest data
      challenge.currentBalance = accountInfo.balance;
      challenge.currentEquity = accountInfo.equity;

      // Update highest equity for equity-based accounts
      if (challenge.accountType === 'equity-based' && accountInfo.equity > challenge.highestEquity) {
        challenge.highestEquity = accountInfo.equity;
      }

      // Check maximum drawdown
      const maxDrawdownCheck = this.checkMaxDrawdown(challenge, accountInfo);
      if (!maxDrawdownCheck.valid) {
        violations.push(maxDrawdownCheck.violation);
      }

      // Check daily drawdown
      const dailyDrawdownCheck = this.checkDailyDrawdown(challenge, accountInfo);
      if (!dailyDrawdownCheck.valid) {
        violations.push(dailyDrawdownCheck.violation);
      }

      // Check profit target (for phases 1 and 2)
      if (challenge.phase < 3) {
        const profitCheck = await this.checkProfitTarget(challenge);
        if (profitCheck.achieved) {
          // Phase completed!
          await challenge.save();
          return { valid: true, violations: [], phaseCompleted: true };
        }
      }

      // Check minimum trading days
      const tradingDaysCheck = await this.checkMinimumTradingDays(challenge);

      // Check consistency rule (for equity-based)
      if (challenge.accountType === 'equity-based' && challenge.phase < 3) {
        const consistencyCheck = await this.checkConsistencyRule(challenge);
        if (!consistencyCheck.valid) {
          violations.push(consistencyCheck.violation);
        }
      }

      // Save updated challenge
      if (violations.length > 0) {
        challenge.rulesViolated = violations.map(v => v.rule);
        challenge.status = 'failed';
        challenge.violationDate = new Date();
        challenge.violationReason = violations.map(v => v.message).join('; ');
        challenge.deletionScheduledDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000); // 3 days
      }

      await challenge.save();

      return {
        valid: violations.length === 0,
        violations: violations,
        phaseCompleted: false
      };
    } catch (error) {
      logger.error(`Rule check failed for challenge ${challengeId}:`, error);
      throw error;
    }
  }

  /**
   * Check maximum overall drawdown
   * @param {Object} challenge - Challenge document
   * @param {Object} accountInfo - Current account info from broker
   * @returns {Object} Validation result
   */
  checkMaxDrawdown(challenge, accountInfo) {
    const currentEquity = accountInfo.equity;

    if (challenge.accountType === 'balance-based') {
      // Static drawdown from initial balance
      const maxAllowedDrawdown = challenge.initialBalance * 0.90; // 10% drawdown

      if (challenge.currentBalance < maxAllowedDrawdown) {
        return {
          valid: false,
          violation: {
            rule: 'max_drawdown',
            message: `Maximum drawdown exceeded. Balance: $${challenge.currentBalance.toFixed(2)}, Limit: $${maxAllowedDrawdown.toFixed(2)}`,
            type: 'balance-based',
            timestamp: new Date()
          }
        };
      }
    } else {
      // Equity-based: Trailing from highest equity
      const highWaterMark = Math.max(challenge.highestEquity, challenge.initialBalance);
      const maxAllowedDrawdown = highWaterMark * 0.90; // 10% from highest equity

      // Update highest equity if current is higher
      if (currentEquity > challenge.highestEquity) {
        challenge.highestEquity = currentEquity;
      }

      if (currentEquity < maxAllowedDrawdown) {
        return {
          valid: false,
          violation: {
            rule: 'max_drawdown',
            message: `Maximum drawdown exceeded. Equity: $${currentEquity.toFixed(2)}, Limit: $${maxAllowedDrawdown.toFixed(2)} (from high: $${highWaterMark.toFixed(2)})`,
            type: 'equity-based',
            timestamp: new Date()
          }
        };
      }
    }

    return { valid: true };
  }

  /**
   * Check daily drawdown limit
   * @param {Object} challenge - Challenge document
   * @param {Object} accountInfo - Current account info
   * @returns {Object} Validation result
   */
  checkDailyDrawdown(challenge, accountInfo) {
    const currentEquity = accountInfo.equity;
    const currentBalance = accountInfo.balance;

    if (challenge.accountType === 'balance-based') {
      // 5% daily loss from initial balance
      const dailyLimit = challenge.initialBalance * 0.95;

      if (currentBalance < dailyLimit) {
        return {
          valid: false,
          violation: {
            rule: 'daily_drawdown',
            message: `Daily loss limit exceeded. Balance: $${currentBalance.toFixed(2)}, Daily Limit: $${dailyLimit.toFixed(2)}`,
            type: 'balance-based',
            timestamp: new Date()
          }
        };
      }
    } else {
      // Equity-based: 5% from daily starting equity
      const dailyStartEquity = challenge.dailyStartEquity || challenge.initialBalance;
      const dailyLimit = dailyStartEquity * 0.95;

      if (currentEquity < dailyLimit) {
        return {
          valid: false,
          violation: {
            rule: 'daily_drawdown',
            message: `Daily loss limit exceeded. Equity: $${currentEquity.toFixed(2)}, Daily Limit: $${dailyLimit.toFixed(2)} (from start: $${dailyStartEquity.toFixed(2)})`,
            type: 'equity-based',
            timestamp: new Date()
          }
        };
      }
    }

    return { valid: true };
  }

  /**
   * Check if profit target is achieved
   * @param {Object} challenge - Challenge document
   * @returns {Object} Result with achieved status
   */
  async checkProfitTarget(challenge) {
    const currentProfit = challenge.currentBalance - challenge.initialBalance;
    const profitTarget = challenge.profitTarget;

    if (currentProfit >= profitTarget) {
      // Check minimum trading days
      const tradingDaysCheck = await this.checkMinimumTradingDays(challenge);

      if (tradingDaysCheck.sufficient) {
        return { achieved: true, currentProfit, profitTarget };
      }
    }

    return { achieved: false, currentProfit, profitTarget };
  }

  /**
   * Check minimum trading days requirement
   * @param {Object} challenge - Challenge document
   * @returns {Object} Result with sufficient status
   */
  async checkMinimumTradingDays(challenge) {
    // Get unique trading days
    const trades = await Trade.find({
      challengeId: challenge._id,
      closeTime: { $exists: true }
    });

    const uniqueDays = new Set();
    trades.forEach(trade => {
      const dateStr = trade.closeTime.toISOString().split('T')[0];
      uniqueDays.add(dateStr);
    });

    const tradingDays = uniqueDays.size;
    const requiredDays = 5;

    challenge.tradingDays = tradingDays;

    return {
      sufficient: tradingDays >= requiredDays,
      current: tradingDays,
      required: requiredDays
    };
  }

  /**
   * Check consistency rule (40% rule for equity-based)
   * @param {Object} challenge - Challenge document
   * @returns {Object} Validation result
   */
  async checkConsistencyRule(challenge) {
    const trades = await Trade.find({
      challengeId: challenge._id,
      closeTime: { $exists: true }
    });

    if (trades.length === 0) return { valid: true };

    // Group trades by day
    const dailyProfits = {};
    trades.forEach(trade => {
      const dateStr = trade.closeTime.toISOString().split('T')[0];
      if (!dailyProfits[dateStr]) {
        dailyProfits[dateStr] = 0;
      }
      dailyProfits[dateStr] += trade.profit;
    });

    // Find highest single day profit
    const dailyProfitValues = Object.values(dailyProfits);
    const maxDailyProfit = Math.max(...dailyProfitValues);
    const totalProfit = challenge.currentBalance - challenge.initialBalance;

    // Check if single day exceeds 40% of total
    if (totalProfit > 0 && maxDailyProfit > (totalProfit * 0.40)) {
      return {
        valid: false,
        violation: {
          rule: 'consistency',
          message: `Consistency rule violated. Single day profit ($${maxDailyProfit.toFixed(2)}) exceeds 40% of total profit ($${totalProfit.toFixed(2)})`,
          type: 'equity-based',
          timestamp: new Date()
        }
      };
    }

    return { valid: true };
  }

  /**
   * Reset daily drawdown limits (called at midnight UTC)
   * @param {String} challengeId - Challenge ID (optional, if not provided, resets all)
   */
  async resetDailyDrawdownLimits(challengeId = null) {
    try {
      let challenges;

      if (challengeId) {
        challenges = [await Challenge.findById(challengeId)];
      } else {
        challenges = await Challenge.find({ status: 'active' });
      }

      for (const challenge of challenges) {
        if (!challenge) continue;

        if (challenge.accountType === 'equity-based') {
          // Update daily start equity to current equity
          try {
            const accountInfo = await brokerService.getAccountInfo(
              challenge._id.toString(),
              challenge.mt4Login,
              challenge.mt4Password,
              challenge.mt4Server
            );
            challenge.dailyStartEquity = accountInfo.equity;
            await challenge.save();
            logger.info(`Reset daily limit for challenge ${challenge._id}: $${accountInfo.equity}`);
          } catch (error) {
            logger.error(`Failed to reset daily limit for challenge ${challenge._id}:`, error);
          }
        }
        // Balance-based doesn't need daily reset as it's static
      }

      logger.info(`Daily drawdown limits reset for ${challenges.length} challenges`);
    } catch (error) {
      logger.error('Failed to reset daily drawdown limits:', error);
    }
  }
}

module.exports = new RuleEngine();
