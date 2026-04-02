/**
 * Payment Service
 * Payment API calls
 */

import api from './api'

class PaymentService {
  /**
   * Process payment
   */
  async processPayment(data) {
    const response = await api.post('/payments/process', data)
    return response.data
  }

  /**
   * Get user transactions
   */
  async getTransactions(limit = 50) {
    const response = await api.get(`/payments/transactions?limit=${limit}`)
    return response.data
  }

  /**
   * Get transaction details
   */
  async getTransaction(transactionId) {
    const response = await api.get(`/payments/transactions/${transactionId}`)
    return response.data
  }

  /**
   * Process refund
   */
  async processRefund(transactionId, amount = null) {
    const response = await api.post('/payments/refund', { transactionId, amount })
    return response.data
  }
}

export default new PaymentService()
