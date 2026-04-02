/**
 * Sync Trades Job
 * Runs every 5 minutes to fetch new trades from broker
 */

const cron = require('node-cron');
const Challenge = require('../models/Challenge');
const brokerService = require('../config/broker');
const logger = require('../utils/logger');

class SyncTradesJob {
  start() {
    // Run every 5 minutes
    cron.schedule('*/5 * * * *', async () => {
      await this.execute();
    });

    logger.info('Sync trades job started (every 5 minutes)');
  }

  async execute() {
    try {
      const activeChallenges = await Challenge.find({
        status: 'active'
      });

      logger.info(`Syncing trades for ${activeChallenges.length} active challenges`);

      for (const challenge of activeChallenges) {
        try {
          // Get account info and update challenge
          const accountInfo = await brokerService.getAccountInfo(
            challenge._id.toString(),
            challenge.mt4Login,
            challenge.mt4Password,
            challenge.mt4Server
          );

          challenge.currentBalance = accountInfo.balance;
          challenge.currentEquity = accountInfo.equity;

          // Update highest equity for equity-based
          if (challenge.accountType === 'equity-based' && accountInfo.equity > challenge.highestEquity) {
            challenge.highestEquity = accountInfo.equity;
          }

          await challenge.save();

          logger.info(`Synced challenge ${challenge._id}: Balance $${accountInfo.balance}, Equity $${accountInfo.equity}`);
        } catch (error) {
          logger.error(`Failed to sync challenge ${challenge._id}:`, error);
        }
      }
    } catch (error) {
      logger.error('Sync trades job failed:', error);
    }
  }
}

module.exports = new SyncTradesJob();
