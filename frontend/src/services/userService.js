/**
 * User Service
 * User API calls
 */

import api from './api'

class UserService {
  /**
   * Get user profile
   */
  async getProfile() {
    const response = await api.get('/users/me')
    return response.data
  }

  /**
   * Update profile
   */
  async updateProfile(profileData) {
    const response = await api.put('/users/me', profileData)
    return response.data
  }

  /**
   * Get user challenges
   */
  async getChallenges(status = null) {
    const url = status ? `/users/me/challenges?status=${status}` : '/users/me/challenges'
    const response = await api.get(url)
    return response.data
  }

  /**
   * Get dashboard data
   */
  async getDashboard() {
    const response = await api.get('/users/me/dashboard')
    return response.data
  }
}

export default new UserService()
