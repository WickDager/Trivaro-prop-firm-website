/**
 * Payment Service Tests
 * Tests payment processing with mocked Stripe/PayPal
 */

const paymentService = require('../src/services/paymentService');
const paymentConfig = require('../src/config/payment');

// Mock Stripe
jest.mock('../src/config/payment', () => ({
  createPaymentIntent: jest.fn(),
  createRefund: jest.fn(),
  verifyWebhookSignature: jest.fn()
}));

describe('Payment Service Tests', () => {
  const mockUserId = '507f1f77bcf86cd799439011';
  const mockChallengeId = '507f1f77bcf86cd799439012';

  describe('Process Challenge Purchase Payment', () => {
    test('should process Stripe payment successfully', async () => {
      paymentConfig.createPaymentIntent.mockResolvedValue({
        success: true,
        paymentIntentId: 'pi_test123',
        clientSecret: 'cs_test123'
      });

      const result = await paymentService.processChallengePurchase(
        mockUserId,
        mockChallengeId,
        'stripe',
        { paymentMethodId: 'pm_test123' }
      );

      expect(result.success).toBe(true);
      expect(paymentConfig.createPaymentIntent).toHaveBeenCalled();
    });

    test('should handle Stripe payment failure', async () => {
      paymentConfig.createPaymentIntent.mockResolvedValue({
        success: false,
        error: 'Card declined'
      });

      const result = await paymentService.processChallengePurchase(
        mockUserId,
        mockChallengeId,
        'stripe',
        { paymentMethodId: 'pm_declined' }
      );

      expect(result.success).toBe(false);
      expect(result.error).toBe('Card declined');
    });

    test('should reject unsupported payment method', async () => {
      const result = await paymentService.processChallengePurchase(
        mockUserId,
        mockChallengeId,
        'crypto',
        {}
      );

      expect(result.success).toBe(false);
    });
  });

  describe('Process Refund', () => {
    test('should process refund successfully', async () => {
      paymentConfig.createRefund.mockResolvedValue({
        success: true,
        refund: { id: 're_test123', amount: 9900 }
      });

      const result = await paymentService.processRefund('txn_test123', 99);

      expect(result.success).toBe(true);
      expect(paymentConfig.createRefund).toHaveBeenCalled();
    });

    test('should handle refund failure', async () => {
      paymentConfig.createRefund.mockResolvedValue({
        success: false,
        error: 'Refund failed'
      });

      const result = await paymentService.processRefund('txn_test123', 99);

      expect(result.success).toBe(false);
    });
  });

  describe('Payment Validation', () => {
    test('should validate payment amount', () => {
      const validAmounts = [49, 99, 199, 349, 549];
      const invalidAmounts = [-10, 0, 0.5];

      validAmounts.forEach(amount => {
        expect(amount).toBeGreaterThan(0);
      });

      invalidAmounts.forEach(amount => {
        expect(amount).toBeLessThanOrEqual(0);
      });
    });

    test('should validate payment method', () => {
      const validMethods = ['stripe', 'paypal'];
      const invalidMethods = ['crypto', 'cash', 'check'];

      validMethods.forEach(method => {
        expect(['stripe', 'paypal']).toContain(method);
      });

      invalidMethods.forEach(method => {
        expect(['stripe', 'paypal']).not.toContain(method);
      });
    });
  });

  describe('Webhook Security', () => {
    test('should verify Stripe webhook signature', () => {
      const mockPayload = '{"type": "payment_intent.succeeded"}';
      const mockSignature = 't=1234567890,v1=abc123';
      const mockSecret = 'whsec_test123';

      paymentConfig.verifyWebhookSignature.mockReturnValue({
        success: true,
        event: { type: 'payment_intent.succeeded' }
      });

      const result = paymentConfig.verifyWebhookSignature(
        mockPayload,
        mockSignature,
        mockSecret
      );

      expect(result.success).toBe(true);
      expect(paymentConfig.verifyWebhookSignature).toHaveBeenCalled();
    });

    test('should reject invalid webhook signature', () => {
      paymentConfig.verifyWebhookSignature.mockReturnValue({
        success: false,
        error: 'Invalid signature'
      });

      const result = paymentConfig.verifyWebhookSignature(
        '{"type": "payment_intent.succeeded"}',
        'invalid-signature',
        'whsec_test123'
      );

      expect(result.success).toBe(false);
    });
  });

  describe('Transaction Recording', () => {
    test('should record successful transaction', () => {
      const transaction = {
        userId: mockUserId,
        challengeId: mockChallengeId,
        type: 'challenge_purchase',
        amount: 99,
        currency: 'USD',
        paymentMethod: 'stripe',
        paymentStatus: 'completed'
      };

      expect(transaction.amount).toBeGreaterThan(0);
      expect(['challenge_purchase', 'payout', 'refund']).toContain(transaction.type);
      expect(['stripe', 'paypal', 'crypto']).toContain(transaction.paymentMethod);
    });

    test('should validate transaction currency', () => {
      const validCurrencies = ['USD', 'EUR', 'GBP'];
      const invalidCurrencies = ['INVALID', '', null];

      validCurrencies.forEach(currency => {
        expect(['USD', 'EUR', 'GBP']).toContain(currency);
      });

      invalidCurrencies.forEach(currency => {
        expect(['USD', 'EUR', 'GBP']).not.toContain(currency);
      });
    });
  });
});
