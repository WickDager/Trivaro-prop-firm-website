/**
 * Payment Controller
 * Handles payment-related requests
 */

const paymentService = require('../services/paymentService');
const logger = require('../utils/logger');
const asyncHandler = require('../utils/asyncHandler');

/**
 * Process payment
 * POST /api/payments/process
 */
const processPayment = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const { challengeId, paymentMethod, paymentDetails } = req.body;

  const result = await paymentService.processChallengePurchase(
    userId,
    challengeId,
    paymentMethod,
    paymentDetails
  );

  if (result.success) {
    res.status(200).json({
      success: true,
      message: 'Payment processed successfully',
      data: result
    });
  } else {
    res.status(400).json({
      success: false,
      message: result.error
    });
  }
});

/**
 * Get user transactions
 * GET /api/payments/transactions
 */
const getUserTransactions = asyncHandler(async (req, res) => {
  const userId = req.user.userId;
  const { limit } = req.query;

  const transactions = await paymentService.getUserTransactions(
    userId,
    parseInt(limit) || 50
  );

  res.json({
    success: true,
    data: transactions
  });
});

/**
 * Get transaction details
 * GET /api/payments/transactions/:id
 */
const getTransaction = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const transaction = await paymentService.getTransaction(id);

  res.json({
    success: true,
    data: transaction
  });
});

/**
 * Process refund
 * POST /api/payments/refund
 */
const processRefund = asyncHandler(async (req, res) => {
  const { transactionId, amount } = req.body;

  const result = await paymentService.processRefund(transactionId, amount);

  if (result.success) {
    res.json({
      success: true,
      message: 'Refund processed successfully',
      data: result
    });
  } else {
    res.status(400).json({
      success: false,
      message: result.error
    });
  }
});

/**
 * Stripe webhook
 * POST /api/payments/webhooks/stripe
 */
const stripeWebhook = asyncHandler(async (req, res) => {
  const signature = req.headers['stripe-signature'];
  const payload = req.body;

  // Verify webhook signature
  const result = paymentConfig.verifyWebhookSignature(
    payload,
    signature,
    process.env.STRIPE_WEBHOOK_SECRET
  );

  if (!result.success) {
    return res.status(400).json({ error: result.error });
  }

  const event = result.event;

  // Handle different event types
  switch (event.type) {
    case 'payment_intent.succeeded':
      // Payment succeeded
      logger.info('Payment succeeded:', event.data.object.id);
      break;
    case 'payment_intent.payment_failed':
      // Payment failed
      logger.error('Payment failed:', event.data.object.id);
      break;
    default:
      logger.info('Unhandled event type:', event.type);
  }

  res.json({ received: true });
});

module.exports = {
  processPayment,
  getUserTransactions,
  getTransaction,
  processRefund,
  stripeWebhook
};
