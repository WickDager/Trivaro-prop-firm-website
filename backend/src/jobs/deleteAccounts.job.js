/**
 * Delete Expired Accounts Job
 * Runs every 6 hours to delete failed challenges
 */

const cron = require('node-cron');
const Challenge = require('../models/Challenge');
const brokerService = require('../config/broker');
const logger = require('../utils/logger');

class DeleteExpiredAccountsJob {
  start() {
    // Run every 6 hours
    cron.schedule('0 */6 * * *', async () => {
      await this.execute();
    });

    logger.info('Delete expired accounts job started (every 6 hours)');
  }

  async execute() {
    try {
      const now = new Date();
      
      // Find challenges scheduled for deletion
      const expiredChallenges = await Challenge.find({
        status: 'failed',
        deletionScheduledDate: { $lte: now }
      });

      logger.info(`Found ${expiredChallenges.length} expired challenges to delete`);

      for (const challenge of expiredChallenges) {
        try {
          // Delete demo account from broker
          if (challenge.mt4Login) {
            await brokerService.deleteDemoAccount(challenge.mt4Login);
          }

          // Delete challenge from database
          await Challenge.findByIdAndDelete(challenge._id);

          logger.info(`Deleted expired challenge: ${challenge._id}`);
        } catch (error) {
          logger.error(`Failed to delete challenge ${challenge._id}:`, error);
        }
      }
    } catch (error) {
      logger.error('Delete expired accounts job failed:', error);
    }
  }
}

module.exports = new DeleteExpiredAccountsJob();
