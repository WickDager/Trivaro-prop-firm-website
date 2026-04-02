/**
 * Notification Service
 * Manages in-app and email notifications
 */

const Notification = require('../models/Notification');
const User = require('../models/User');
const emailService = require('../config/email');
const logger = require('../utils/logger');

class NotificationService {
  /**
   * Create a notification
   * @param {Object} data - Notification data
   * @returns {Object} Created notification
   */
  async create(data) {
    try {
      const notification = new Notification({
        userId: data.userId,
        type: data.type,
        title: data.title,
        message: data.message,
        data: data.data || {},
        actionUrl: data.actionUrl || '',
        actionLabel: data.actionLabel || '',
        priority: data.priority || 'normal',
        expiresAt: data.expiresAt || null
      });

      await notification.save();
      return notification;
    } catch (error) {
      logger.error('Failed to create notification:', error);
      throw error;
    }
  }

  /**
   * Send rule violation notification
   * @param {String} userId - User ID
   * @param {Object} challenge - Challenge details
   * @param {Array} violations - List of violations
   */
  async sendRuleViolation(userId, challenge, violations) {
    try {
      // Create in-app notification
      await this.create({
        userId,
        type: 'rule_violation',
        title: 'Trading Rule Violation',
        message: `Your challenge account has violated trading rules.`,
        data: {
          challengeId: challenge._id,
          violations: violations.map(v => v.message)
        },
        priority: 'urgent',
        actionUrl: `/challenges/${challenge._id}`
      });

      // Send email
      const user = await User.findById(userId);
      if (user) {
        await emailService.sendRuleViolationEmail(user.email, challenge, violations);
      }

      logger.info(`Rule violation notification sent to user ${userId}`);
    } catch (error) {
      logger.error('Failed to send rule violation notification:', error);
    }
  }

  /**
   * Send phase completion notification
   * @param {String} userId - User ID
   * @param {Object} challenge - Challenge details
   */
  async sendPhaseCompletion(userId, challenge) {
    try {
      const isFunded = challenge.phase === 3;

      // Create in-app notification
      await this.create({
        userId,
        type: 'success',
        title: isFunded ? '🎉 You Are Funded!' : `Phase ${challenge.phase - 1} Completed!`,
        message: isFunded
          ? 'Congratulations! You are now a funded trader.'
          : `You have successfully completed Phase ${challenge.phase - 1}.`,
        data: {
          challengeId: challenge._id,
          phase: challenge.phase
        },
        priority: 'high',
        actionUrl: `/challenges/${challenge._id}`
      });

      // Send email
      const user = await User.findById(userId);
      if (user) {
        await emailService.sendPhaseCompletionEmail(user.email, challenge);
      }

      logger.info(`Phase completion notification sent to user ${userId}`);
    } catch (error) {
      logger.error('Failed to send phase completion notification:', error);
    }
  }

  /**
   * Send account created notification
   * @param {String} userId - User ID
   * @param {Object} challenge - Challenge details
   * @param {Object} credentials - Trading account credentials
   */
  async sendAccountCreated(userId, challenge, credentials) {
    try {
      // Create in-app notification
      await this.create({
        userId,
        type: 'account_created',
        title: 'Trading Account Created',
        message: `Your $${challenge.accountSize.toLocaleString()} Phase ${challenge.phase} account is ready.`,
        data: {
          challengeId: challenge._id,
          login: credentials.login
        },
        priority: 'high',
        actionUrl: `/challenges/${challenge._id}`
      });

      // Send email with credentials
      const user = await User.findById(userId);
      if (user) {
        await emailService.sendCredentialsEmail(
          user.email,
          credentials,
          challenge.accountSize,
          challenge.phase
        );
      }

      logger.info(`Account created notification sent to user ${userId}`);
    } catch (error) {
      logger.error('Failed to send account created notification:', error);
    }
  }

  /**
   * Send payout notification
   * @param {String} userId - User ID
   * @param {Object} payout - Payout details
   */
  async sendPayout(userId, payout) {
    try {
      // Create in-app notification
      await this.create({
        userId,
        type: 'payout',
        title: 'Payout Processed',
        message: `Your payout of $${payout.approvedAmount.toLocaleString()} has been processed.`,
        data: {
          payoutId: payout._id,
          amount: payout.approvedAmount
        },
        priority: 'high'
      });

      // Send email
      const user = await User.findById(userId);
      if (user) {
        await emailService.sendPayoutEmail(user.email, payout);
      }

      logger.info(`Payout notification sent to user ${userId}`);
    } catch (error) {
      logger.error('Failed to send payout notification:', error);
    }
  }

  /**
   * Get user notifications
   * @param {String} userId - User ID
   * @param {Number} limit - Max notifications to return
   * @param {Boolean} unreadOnly - Only return unread notifications
   * @returns {Array} Notifications
   */
  async getUserNotifications(userId, limit = 50, unreadOnly = false) {
    return await Notification.getUserNotifications(userId, limit, unreadOnly);
  }

  /**
   * Get unread count
   * @param {String} userId - User ID
   * @returns {Number} Unread count
   */
  async getUnreadCount(userId) {
    return await Notification.getUnreadCount(userId);
  }

  /**
   * Mark notification as read
   * @param {String} notificationId - Notification ID
   * @param {String} userId - User ID (for verification)
   * @returns {Object} Updated notification
   */
  async markAsRead(notificationId, userId) {
    const notification = await Notification.findOne({
      _id: notificationId,
      userId
    });

    if (!notification) {
      throw new Error('Notification not found');
    }

    return await notification.markAsRead();
  }

  /**
   * Mark all notifications as read
   * @param {String} userId - User ID
   */
  async markAllAsRead(userId) {
    return await Notification.markAllAsRead(userId);
  }

  /**
   * Delete old notifications
   * @param {String} userId - User ID
   * @param {Number} daysOld - Delete notifications older than this many days
   */
  async deleteOld(userId, daysOld = 30) {
    return await Notification.deleteOldNotifications(userId, daysOld);
  }

  /**
   * Send system notification to all users
   * @param {Object} data - Notification data
   */
  async sendSystemNotification(data) {
    try {
      const users = await User.find({ isActive: true });

      for (const user of users) {
        await this.create({
          userId: user._id,
          type: 'system',
          title: data.title,
          message: data.message,
          priority: data.priority || 'normal',
          actionUrl: data.actionUrl || '',
          expiresAt: data.expiresAt || null
        });
      }

      logger.info(`System notification sent to ${users.length} users`);
    } catch (error) {
      logger.error('Failed to send system notification:', error);
    }
  }
}

module.exports = new NotificationService();
