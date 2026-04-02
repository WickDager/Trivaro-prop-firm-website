/**
 * Reset Daily Drawdown Job
 * Runs at midnight UTC to reset daily drawdown limits
 */

const cron = require('node-cron');
const ruleEngine = require('../services/ruleEngine');
const logger = require('../utils/logger');

class ResetDailyDrawdownJob {
  start() {
    // Run at midnight UTC every day
    cron.schedule('0 0 * * *', async () => {
      await this.execute();
    });

    logger.info('Reset daily drawdown job started (midnight UTC)');
  }

  async execute() {
    try {
      logger.info('Resetting daily drawdown limits...');
      await ruleEngine.resetDailyDrawdownLimits();
      logger.info('Daily drawdown limits reset complete');
    } catch (error) {
      logger.error('Reset daily drawdown job failed:', error);
    }
  }
}

module.exports = new ResetDailyDrawdownJob();
