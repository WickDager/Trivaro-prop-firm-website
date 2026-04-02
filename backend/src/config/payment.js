/**
 * Payment Gateway Configuration
 * Stripe and PayPal setup
 */

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const logger = require('../utils/logger');

/**
 * Create a payment intent
 * @param {Number} amount - Amount in cents
 * @param {String} currency - Currency code
 * @param {String} customerId - Customer ID
 * @returns {Promise<Object>} Payment intent
 */
const createPaymentIntent = async (amount, currency = 'usd', customerId = null) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      customer: customerId,
      automatic_payment_methods: {
        enabled: true
      },
      metadata: {
        platform: 'trivaro'
      }
    });

    logger.info(`Payment intent created: ${paymentIntent.id}`);
    return {
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    };
  } catch (error) {
    logger.error('Failed to create payment intent:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Retrieve a payment intent
 * @param {String} paymentIntentId - Payment intent ID
 * @returns {Promise<Object>} Payment intent
 */
const getPaymentIntent = async (paymentIntentId) => {
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    return {
      success: true,
      paymentIntent
    };
  } catch (error) {
    logger.error('Failed to retrieve payment intent:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Create a Stripe customer
 * @param {String} email - Customer email
 * @param {String} name - Customer name
 * @returns {Promise<Object>} Customer
 */
const createCustomer = async (email, name) => {
  try {
    const customer = await stripe.customers.create({
      email,
      name,
      metadata: {
        platform: 'trivaro'
      }
    });

    logger.info(`Stripe customer created: ${customer.id}`);
    return {
      success: true,
      customerId: customer.id
    };
  } catch (error) {
    logger.error('Failed to create customer:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Create a refund
 * @param {String} paymentIntentId - Payment intent ID
 * @param {Number} amount - Amount to refund (optional, full refund if not specified)
 * @returns {Promise<Object>} Refund
 */
const createRefund = async (paymentIntentId, amount = null) => {
  try {
    const refund = await stripe.refunds.create({
      payment_intent: paymentIntentId,
      amount: amount ? Math.round(amount * 100) : undefined,
      reason: 'requested_by_customer'
    });

    logger.info(`Refund created: ${refund.id}`);
    return {
      success: true,
      refund
    };
  } catch (error) {
    logger.error('Failed to create refund:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Verify webhook signature
 * @param {String} payload - Raw webhook payload
 * @param {String} signature - Webhook signature
 * @param {String} endpointSecret - Webhook endpoint secret
 * @returns {Object} Verified event
 */
const verifyWebhookSignature = (payload, signature, endpointSecret) => {
  try {
    const event = stripe.webhooks.constructEvent(payload, signature, endpointSecret);
    return {
      success: true,
      event
    };
  } catch (error) {
    logger.error('Webhook signature verification failed:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

module.exports = {
  stripe,
  createPaymentIntent,
  getPaymentIntent,
  createCustomer,
  createRefund,
  verifyWebhookSignature
};
