/**
 * Check Rules Job
 * Runs every 10 minutes to check all active challenges
 */

const cron = require('node-cron');
const Challenge = require('../models/Challenge');
const ruleEngine = require('../services/ruleEngine');
const logger = require('../utils/logger');

class CheckRulesJob {
  start() {
    // Run every 10 minutes
    cron.schedule('*/10 * * * *', async () => {
      await this.execute();
    });

    logger.info('Check rules job started (every 10 minutes)');
  }

  async execute() {
    try {
      const activeChallenges = await Challenge.find({
        status: 'active'
      }).populate('userId');

      logger.info(`Checking rules for ${activeChallenges.length} challenges`);

      for (const challenge of activeChallenges) {
        try {
          const result = await ruleEngine.checkAllRules(challenge._id);

          if (!result.valid && result.violations.length > 0) {
            logger.warn(`Challenge ${challenge._id} violated rules:`, result.violations);
          } else if (result.phaseCompleted) {
            logger.info(`Challenge ${challenge._id} completed phase ${challenge.phase}`);
          }
        } catch (error) {
          logger.error(`Rule check failed for challenge ${challenge._id}:`, error);
        }
      }
    } catch (error) {
      logger.error('Check rules job failed:', error);
    }
  }
}

module.exports = new CheckRulesJob();
