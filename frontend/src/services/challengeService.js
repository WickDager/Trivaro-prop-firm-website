/**
 * Challenge Service
 * Challenge API calls
 */

import api from './api'

class ChallengeService {
  /**
   * Purchase challenge
   */
  async purchaseChallenge(data) {
    const response = await api.post('/challenges/purchase', data)
    return response.data
  }

  /**
   * Get user challenges
   */
  async getChallenges(status = null) {
    const url = status ? `/challenges?status=${status}` : '/challenges'
    const response = await api.get(url)
    return response.data
  }

  /**
   * Get challenge details
   */
  async getChallengeDetails(challengeId) {
    const response = await api.get(`/challenges/${challengeId}`)
    return response.data
  }

  /**
   * Get challenge trades
   */
  async getTradeHistory(challengeId, closedOnly = false) {
    const url = closedOnly 
      ? `/challenges/${challengeId}/trades?closedOnly=true`
      : `/challenges/${challengeId}/trades`
    const response = await api.get(url)
    return response.data
  }

  /**
   * Get challenge statistics
   */
  async getStatistics(challengeId) {
    const response = await api.get(`/challenges/${challengeId}/statistics`)
    return response.data
  }

  /**
   * Get equity history
   */
  async getEquityHistory(challengeId, days = 30) {
    const response = await api.get(`/challenges/${challengeId}/equity-history?days=${days}`)
    return response.data
  }

  /**
   * Sync trades
   */
  async syncTrades(challengeId) {
    const response = await api.post(`/challenges/${challengeId}/sync`)
    return response.data
  }

  /**
   * Delete challenge
   */
  async deleteChallenge(challengeId) {
    const response = await api.delete(`/challenges/${challengeId}`)
    return response.data
  }
}

export default new ChallengeService()
