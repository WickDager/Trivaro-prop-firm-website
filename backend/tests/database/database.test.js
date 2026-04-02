/**
 * Database Tests
 * Tests for MongoDB models, indexes, and data integrity
 */

const mongoose = require('mongoose');
const User = require('../src/models/User');
const Challenge = require('../src/models/Challenge');
const Trade = require('../src/models/Trade');
const Transaction = require('../src/models/Transaction');

describe('Database Tests', () => {
  beforeAll(async () => {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/trivaro_test');
    }
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    // Clear all collections
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      await collections[key].deleteMany({});
    }
  });

  describe('User Model', () => {
    test('should create user successfully', async () => {
      const userData = {
        email: 'test@example.com',
        passwordHash: 'hashedpassword123',
        firstName: 'Test',
        lastName: 'User'
      };

      const user = new User(userData);
      await user.save();

      expect(user._id).toBeDefined();
      expect(user.email).toBe(userData.email);
      expect(user.createdAt).toBeDefined();
    });

    test('should enforce unique email', async () => {
      const userData = {
        email: 'duplicate@example.com',
        passwordHash: 'hashedpassword123',
        firstName: 'Test',
        lastName: 'User'
      };

      await User.create(userData);

      // Try to create another user with same email
      await expect(User.create(userData)).rejects.toThrow();
    });

    test('should validate email format', async () => {
      const userData = {
        email: 'invalid-email',
        passwordHash: 'hashedpassword123',
        firstName: 'Test',
        lastName: 'User'
      };

      const user = new User(userData);
      await expect(user.save()).rejects.toThrow();
    });

    test('should hash password before saving', async () => {
      const userData = {
        email: 'hashtest@example.com',
        passwordHash: 'plainpassword',
        firstName: 'Test',
        lastName: 'User'
      };

      const user = new User(userData);
      await user.save();

      const savedUser = await User.findById(user._id).select('+passwordHash');
      expect(savedUser.passwordHash).not.toBe('plainpassword');
    });

    test('should compare password correctly', async () => {
      const userData = {
        email: 'comparetest@example.com',
        passwordHash: 'TestPassword123!',
        firstName: 'Test',
        lastName: 'User'
      };

      const user = new User(userData);
      await user.save();

      const savedUser = await User.findById(user._id).select('+passwordHash');
      const isValid = await savedUser.comparePassword('TestPassword123!');
      expect(isValid).toBe(true);
    });
  });

  describe('Challenge Model', () => {
    test('should create challenge successfully', async () => {
      const user = await User.create({
        email: 'challenge-test@example.com',
        passwordHash: 'hashedpassword123',
        firstName: 'Test',
        lastName: 'User'
      });

      const challengeData = {
        userId: user._id,
        accountSize: 10000,
        accountType: 'balance-based',
        phase: 1,
        status: 'active',
        initialBalance: 10000,
        profitTarget: 1000,
        maxDrawdown: 1000,
        dailyDrawdownLimit: 500
      };

      const challenge = new Challenge(challengeData);
      await challenge.save();

      expect(challenge._id).toBeDefined();
      expect(challenge.accountSize).toBe(10000);
      expect(challenge.status).toBe('active');
    });

    test('should validate account size enum', async () => {
      const user = await User.create({
        email: 'acctsize-test@example.com',
        passwordHash: 'hashedpassword123',
        firstName: 'Test',
        lastName: 'User'
      });

      const challengeData = {
        userId: user._id,
        accountSize: 99999, // Invalid
        accountType: 'balance-based',
        phase: 1,
        initialBalance: 99999
      };

      const challenge = new Challenge(challengeData);
      await expect(challenge.save()).rejects.toThrow();
    });

    test('should calculate profit percentage', async () => {
      const user = await User.create({
        email: 'profit-test@example.com',
        passwordHash: 'hashedpassword123',
        firstName: 'Test',
        lastName: 'User'
      });

      const challenge = new Challenge({
        userId: user._id,
        accountSize: 10000,
        accountType: 'balance-based',
        phase: 1,
        initialBalance: 10000,
        currentBalance: 11000
      });

      const profitPercent = challenge.getProfitPercentage();
      expect(profitPercent).toBe(10);
    });

    test('should calculate drawdown percentage', async () => {
      const user = await User.create({
        email: 'drawdown-test@example.com',
        passwordHash: 'hashedpassword123',
        firstName: 'Test',
        lastName: 'User'
      });

      const challenge = new Challenge({
        userId: user._id,
        accountSize: 10000,
        accountType: 'balance-based',
        phase: 1,
        initialBalance: 10000,
        currentBalance: 95000
      });

      const drawdownPercent = challenge.getDrawdownPercentage();
      expect(drawdownPercent).toBeLessThan(0); // Negative means profit
    });
  });

  describe('Trade Model', () => {
    test('should create trade successfully', async () => {
      const user = await User.create({
        email: 'trade-test@example.com',
        passwordHash: 'hashedpassword123',
        firstName: 'Test',
        lastName: 'User'
      });

      const challenge = await Challenge.create({
        userId: user._id,
        accountSize: 10000,
        accountType: 'balance-based',
        phase: 1,
        initialBalance: 10000
      });

      const tradeData = {
        challengeId: challenge._id,
        userId: user._id,
        ticketNumber: 12345,
        symbol: 'EURUSD',
        type: 'buy',
        volume: 1.0,
        openPrice: 1.1000,
        closePrice: 1.1050,
        openTime: new Date(),
        closeTime: new Date(),
        profit: 50
      };

      const trade = new Trade(tradeData);
      await trade.save();

      expect(trade._id).toBeDefined();
      expect(trade.symbol).toBe('EURUSD');
      expect(trade.profit).toBe(50);
    });

    test('should calculate net profit', async () => {
      const user = await User.create({
        email: 'netprofit-test@example.com',
        passwordHash: 'hashedpassword123',
        firstName: 'Test',
        lastName: 'User'
      });

      const challenge = await Challenge.create({
        userId: user._id,
        accountSize: 10000,
        accountType: 'balance-based',
        phase: 1,
        initialBalance: 10000
      });

      const trade = new Trade({
        challengeId: challenge._id,
        userId: user._id,
        ticketNumber: 12346,
        symbol: 'GBPUSD',
        type: 'sell',
        volume: 1.0,
        openPrice: 1.3000,
        closePrice: 1.2950,
        openTime: new Date(),
        closeTime: new Date(),
        profit: 100,
        commission: -5,
        swap: -2
      });

      const netProfit = trade.getNetProfit();
      expect(netProfit).toBe(93);
    });
  });

  describe('Transaction Model', () => {
    test('should create transaction successfully', async () => {
      const user = await User.create({
        email: 'txn-test@example.com',
        passwordHash: 'hashedpassword123',
        firstName: 'Test',
        lastName: 'User'
      });

      const transactionData = {
        userId: user._id,
        type: 'challenge_purchase',
        amount: 99,
        currency: 'USD',
        paymentMethod: 'stripe',
        paymentStatus: 'completed'
      };

      const transaction = new Transaction(transactionData);
      await transaction.save();

      expect(transaction._id).toBeDefined();
      expect(transaction.amount).toBe(99);
      expect(transaction.paymentStatus).toBe('completed');
    });

    test('should format amount correctly', async () => {
      const user = await User.create({
        email: 'format-test@example.com',
        passwordHash: 'hashedpassword123',
        firstName: 'Test',
        lastName: 'User'
      });

      const transaction = new Transaction({
        userId: user._id,
        type: 'challenge_purchase',
        amount: 99,
        currency: 'USD',
        paymentMethod: 'stripe',
        paymentStatus: 'completed'
      });

      const formatted = transaction.getFormattedAmount();
      expect(formatted).toBe('$99.00');
    });
  });

  describe('Data Integrity', () => {
    test('should maintain referential integrity', async () => {
      const user = await User.create({
        email: 'ref-test@example.com',
        passwordHash: 'hashedpassword123',
        firstName: 'Test',
        lastName: 'User'
      });

      const challenge = await Challenge.create({
        userId: user._id,
        accountSize: 10000,
        accountType: 'balance-based',
        phase: 1,
        initialBalance: 10000
      });

      // Create trade with valid references
      const trade = await Trade.create({
        challengeId: challenge._id,
        userId: user._id,
        ticketNumber: 99999,
        symbol: 'EURUSD',
        type: 'buy',
        volume: 1.0,
        openPrice: 1.1000,
        openTime: new Date(),
        profit: 50
      });

      expect(trade.challengeId.toString()).toBe(challenge._id.toString());
      expect(trade.userId.toString()).toBe(user._id.toString());
    });

    test('should handle cascade deletes', async () => {
      const user = await User.create({
        email: 'cascade-test@example.com',
        passwordHash: 'hashedpassword123',
        firstName: 'Test',
        lastName: 'User'
      });

      const challenge = await Challenge.create({
        userId: user._id,
        accountSize: 10000,
        accountType: 'balance-based',
        phase: 1,
        initialBalance: 10000
      });

      await Trade.create({
        challengeId: challenge._id,
        userId: user._id,
        ticketNumber: 88888,
        symbol: 'EURUSD',
        type: 'buy',
        volume: 1.0,
        openPrice: 1.1000,
        openTime: new Date(),
        profit: 50
      });

      // Delete user
      await User.findByIdAndDelete(user._id);

      // Challenge should still exist (no cascade by default)
      const remainingChallenge = await Challenge.findById(challenge._id);
      expect(remainingChallenge).toBeDefined();
    });
  });

  describe('Index Performance', () => {
    test('should have indexes on User model', async () => {
      const indexes = await User.listIndexes();
      const indexNames = indexes.map(idx => idx.key);

      expect(indexNames).toEqual(
        expect.arrayContaining([
          { email: 1 },
          { role: 1 },
          { isActive: 1 }
        ])
      );
    });

    test('should have indexes on Challenge model', async () => {
      const indexes = await Challenge.listIndexes();
      const indexKeys = indexes.map(idx => idx.key);

      expect(indexKeys).toEqual(
        expect.arrayContaining([
          { userId: 1 },
          { status: 1 },
          { phase: 1 },
          { mt4Login: 1 }
        ])
      );
    });
  });
});
