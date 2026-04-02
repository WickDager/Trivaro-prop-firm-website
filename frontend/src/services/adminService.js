/**
 * Admin Service
 * Admin API calls
 */

import api from './api'

class AdminService {
  /**
   * Get dashboard statistics
   */
  async getStats() {
    const response = await api.get('/admin/stats')
    return response.data
  }

  /**
   * Get all users
   */
  async getUsers(page = 1, limit = 50, status = null) {
    const url = `/admin/users?page=${page}&limit=${limit}${status ? `&status=${status}` : ''}`
    const response = await api.get(url)
    return response.data
  }

  /**
   * Update user
   */
  async updateUser(userId, userData) {
    const response = await api.put(`/admin/users/${userId}`, userData)
    return response.data
  }

  /**
   * Get all challenges
   */
  async getChallenges(page = 1, limit = 50, status = null, phase = null) {
    const url = `/admin/challenges?page=${page}&limit=${limit}${status ? `&status=${status}` : ''}${phase ? `&phase=${phase}` : ''}`
    const response = await api.get(url)
    return response.data
  }

  /**
   * Get all payouts
   */
  async getPayouts(page = 1, limit = 50, status = null) {
    const url = `/admin/payouts?page=${page}&limit=${limit}${status ? `&status=${status}` : ''}`
    const response = await api.get(url)
    return response.data
  }

  /**
   * Approve payout
   */
  async approvePayout(payoutId, approvedAmount) {
    const response = await api.post(`/admin/payouts/${payoutId}/approve`, { approvedAmount })
    return response.data
  }

  /**
   * Get audit logs
   */
  async getAuditLogs(page = 1, limit = 50, action = null, userId = null) {
    const url = `/admin/audit-logs?page=${page}&limit=${limit}${action ? `&action=${action}` : ''}${userId ? `&userId=${userId}` : ''}`
    const response = await api.get(url)
    return response.data
  }
}

export default new AdminService()
