/**
 * Auth Service
 * Authentication API calls
 */

import api from './api'

class AuthService {
  /**
   * Register new user
   */
  async register(userData) {
    const response = await api.post('/auth/register', userData)
    return response.data
  }

  /**
   * Login user
   */
  async login(credentials) {
    const response = await api.post('/auth/login', credentials)
    if (response.data.success) {
      const { accessToken, refreshToken } = response.data.data.tokens
      localStorage.setItem('accessToken', accessToken)
      localStorage.setItem('refreshToken', refreshToken)
      localStorage.setItem('userRole', response.data.data.user.role)
    }
    return response.data
  }

  /**
   * Logout user
   */
  async logout() {
    const refreshToken = localStorage.getItem('refreshToken')
    try {
      await api.post('/auth/logout', { refreshToken })
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      localStorage.clear()
    }
  }

  /**
   * Get current user
   */
  async getCurrentUser() {
    const response = await api.get('/auth/me')
    return response.data
  }

  /**
   * Update profile
   */
  async updateProfile(profileData) {
    const response = await api.put('/auth/profile', profileData)
    return response.data
  }

  /**
   * Change password
   */
  async changePassword(passwordData) {
    const response = await api.post('/auth/change-password', passwordData)
    return response.data
  }

  /**
   * Request password reset
   */
  async forgotPassword(email) {
    const response = await api.post('/auth/forgot-password', { email })
    return response.data
  }

  /**
   * Reset password
   */
  async resetPassword(token, password) {
    const response = await api.post('/auth/reset-password', { token, password })
    return response.data
  }
}

export default new AuthService()
