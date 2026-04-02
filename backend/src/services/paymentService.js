/**
 * Payment Service
 * Payment processing logic
 */

const Transaction = require('../models/Transaction');
const Challenge = require('../models/Challenge');
const paymentConfig = require('../config/payment');
const logger = require('../utils/logger');
const challengeService = require('./challengeService');

class PaymentService {
  /**
   * Process challenge purchase payment
   * @param {String} userId - User ID
   * @param {String} challengeId - Challenge ID
   * @param {String} paymentMethod - Payment method
   * @param {Object} paymentDetails - Payment details from frontend
   * @returns {Object} Payment result
   */
  async processChallengePurchase(userId, challengeId, paymentMethod, paymentDetails) {
    try {
      const challenge = await Challenge.findById(challengeId);
      if (!challenge) {
        throw new Error('Challenge not found');
      }

      if (challenge.userId.toString() !== userId) {
        throw new Error('Unauthorized');
      }

      if (challenge.status !== 'pending') {
        throw new Error('Challenge is not pending payment');
      }

      // Get transaction
      const transaction = await Transaction.findOne({ challengeId });
      if (!transaction) {
        throw new Error('Transaction not found');
      }

      let paymentResult;

      if (paymentMethod === 'stripe') {
        paymentResult = await this.processStripePayment(transaction, paymentDetails);
      } else if (paymentMethod === 'paypal') {
        paymentResult = await this.processPaypalPayment(transaction, paymentDetails);
      } else {
        throw new Error('Unsupported payment method');
      }

      if (!paymentResult.success) {
        transaction.paymentStatus = 'failed';
        await transaction.save();
        throw new Error(paymentResult.error || 'Payment failed');
      }

      // Update transaction
      transaction.paymentStatus = 'completed';
      transaction.paymentGatewayId = paymentResult.paymentIntentId || paymentResult.id;
      transaction.processedAt = new Date();
      await transaction.save();

      // Complete challenge purchase
      const { credentials } = await challengeService.completePurchase(
        challengeId,
        transaction.paymentGatewayId
      );

      logger.info(`Payment processed successfully: ${transaction._id}`);

      return {
        success: true,
        transaction,
        credentials
      };
    } catch (error) {
      logger.error('Payment processing failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Process Stripe payment
   * @param {Object} transaction - Transaction document
   * @param {Object} paymentDetails - Stripe payment details
   * @returns {Object} Payment result
   */
  async processStripePayment(transaction, paymentDetails) {
    try {
      const { paymentMethodId, customerId } = paymentDetails;

      // Create payment intent
      const result = await paymentConfig.createPaymentIntent(
        transaction.amount,
        'usd',
        customerId
      );

      if (!result.success) {
        return { success: false, error: result.error };
      }

      return {
        success: true,
        paymentIntentId: result.paymentIntentId,
        clientSecret: result.clientSecret
      };
    } catch (error) {
      logger.error('Stripe payment failed:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Process PayPal payment
   * @param {Object} transaction - Transaction document
   * @param {Object} paymentDetails - PayPal payment details
   * @returns {Object} Payment result
   */
  async processPaypalPayment(transaction, paymentDetails) {
    try {
      // PayPal integration would go here
      // For now, return mock success
      return {
        success: true,
        id: `PAYPAL-${Date.now()}`
      };
    } catch (error) {
      logger.error('PayPal payment failed:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Process refund
   * @param {String} transactionId - Transaction ID
   * @param {Number} amount - Refund amount (optional, full refund if not specified)
   * @returns {Object} Refund result
   */
  async processRefund(transactionId, amount = null) {
    try {
      const transaction = await Transaction.findById(transactionId);
      if (!transaction) {
        throw new Error('Transaction not found');
      }

      if (transaction.paymentStatus !== 'completed') {
        throw new Error('Transaction not completed');
      }

      let refundResult;

      if (transaction.paymentMethod === 'stripe') {
        refundResult = await paymentConfig.createRefund(transaction.paymentGatewayId, amount);
      } else {
        throw new Error('Refunds not supported for this payment method');
      }

      if (!refundResult.success) {
        throw new Error(refundResult.error);
      }

      // Update transaction
      transaction.paymentStatus = 'refunded';
      await transaction.save();

      logger.info(`Refund processed: ${transactionId}`);

      return {
        success: true,
        refund: refundResult.refund
      };
    } catch (error) {
      logger.error('Refund failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Get user transactions
   * @param {String} userId - User ID
   * @param {Number} limit - Limit results
   * @returns {Array} Transactions
   */
  async getUserTransactions(userId, limit = 50) {
    return await Transaction.getUserTransactions(userId, limit);
  }

  /**
   * Get transaction by ID
   * @param {String} transactionId - Transaction ID
   * @returns {Object} Transaction
   */
  async getTransaction(transactionId) {
    const transaction = await Transaction.findById(transactionId)
      .populate('challengeId')
      .populate('userId', 'email firstName lastName');

    if (!transaction) {
      throw new Error('Transaction not found');
    }

    return transaction;
  }
}

module.exports = new PaymentService();
