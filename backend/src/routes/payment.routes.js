/**
 * Payment Routes
 */

const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { verifyToken } = require('../middleware/auth.middleware');
const { validate, schemas } = require('../middleware/validation.middleware');
const { paymentLimiter } = require('../middleware/rateLimit.middleware');

// All routes require authentication
router.use(verifyToken);

router.post('/process', paymentLimiter, validate(schemas.payment), paymentController.processPayment);
router.get('/transactions', paymentController.getUserTransactions);
router.get('/transactions/:id', paymentController.getTransaction);
router.post('/refund', paymentLimiter, paymentController.processRefund);

// Webhook route (no auth, verified by signature)
router.post('/webhooks/stripe', express.raw({ type: 'application/json' }), paymentController.stripeWebhook);

module.exports = router;
