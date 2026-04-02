/**
 * Notification Controller
 * Handles notification-related requests
 */

const notificationService = require('../services/notificationService');
const asyncHandler = require('../utils/asyncHandler');

/**
 * Get user notifications
 * GET /api/notifications
 */
const getNotifications = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const { limit, unreadOnly } = req.query;

  const notifications = await notificationService.getUserNotifications(
    userId,
    parseInt(limit) || 50,
    unreadOnly === 'true'
  );

  res.json({
    success: true,
    data: notifications
  });
});

/**
 * Get unread count
 * GET /api/notifications/unread-count
 */
const getUnreadCount = asyncHandler(async (req, res) => {
  const userId = req.user.userId;

  const count = await notificationService.getUnreadCount(userId);

  res.json({
    success: true,
    data: { count }
  });
});

/**
 * Mark notification as read
 * PATCH /api/notifications/:id/read
 */
const markAsRead = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.userId;

  const notification = await notificationService.markAsRead(id, userId);

  res.json({
    success: true,
    data: notification
  });
});

/**
 * Mark all as read
 * PATCH /api/notifications/read-all
 */
const markAllAsRead = asyncHandler(async (req, res) => {
  const userId = req.user.userId;

  await notificationService.markAllAsRead(userId);

  res.json({
    success: true,
    message: 'All notifications marked as read'
  });
});

/**
 * Delete old notifications
 * DELETE /api/notifications/old
 */
const deleteOld = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const { daysOld } = req.query;

  await notificationService.deleteOld(userId, parseInt(daysOld) || 30);

  res.json({
    success: true,
    message: 'Old notifications deleted'
  });
});

module.exports = {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteOld
};
