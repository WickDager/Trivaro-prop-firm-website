/**
 * Notification Service
 * Notification API calls
 */

import api from './api'

class NotificationService {
  /**
   * Get user notifications
   */
  async getNotifications(limit = 50, unreadOnly = false) {
    const url = `/notifications?limit=${limit}&unreadOnly=${unreadOnly}`
    const response = await api.get(url)
    return response.data
  }

  /**
   * Get unread count
   */
  async getUnreadCount() {
    const response = await api.get('/notifications/unread-count')
    return response.data
  }

  /**
   * Mark notification as read
   */
  async markAsRead(notificationId) {
    const response = await api.patch(`/notifications/${notificationId}/read`)
    return response.data
  }

  /**
   * Mark all as read
   */
  async markAllAsRead() {
    const response = await api.patch('/notifications/read-all')
    return response.data
  }

  /**
   * Delete old notifications
   */
  async deleteOld(daysOld = 30) {
    const response = await api.delete(`/notifications/old?daysOld=${daysOld}`)
    return response.data
  }
}

export default new NotificationService()
