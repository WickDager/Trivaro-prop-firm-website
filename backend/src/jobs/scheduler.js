/**
 * Job Scheduler
 * Initializes and starts all scheduled jobs
 */

const syncTradesJob = require('./syncTrades.job');
const checkRulesJob = require('./checkRules.job');
const resetDailyDrawdownJob = require('./resetDailyLimits.job');
const deleteExpiredAccountsJob = require('./deleteAccounts.job');
const logger = require('../utils/logger');

class JobScheduler {
  start() {
    if (process.env.ENABLE_CRON_JOBS !== 'false') {
      logger.info('Starting scheduled jobs...');

      // Start all jobs
      syncTradesJob.start();
      checkRulesJob.start();
      resetDailyDrawdownJob.start();
      deleteExpiredAccountsJob.start();

      logger.info('All scheduled jobs started');
    } else {
      logger.info('Scheduled jobs disabled');
    }
  }

  stop() {
    logger.info('Stopping scheduled jobs...');
    // Cron jobs will stop automatically when process exits
  }
}

module.exports = new JobScheduler();
