/**
 * Backend Test Configuration
 * Jest setup for testing
 */

const mongoose = require('mongoose');
const redis = require('ioredis');

// Mock environment variables for testing
process.env.NODE_ENV = 'test';
process.env.MONGODB_URI = process.env.MONGODB_URI_TEST || 'mongodb://localhost:27017/trivaro_test';
process.env.REDIS_HOST = process.env.REDIS_HOST_TEST || 'localhost';
process.env.REDIS_PORT = process.env.REDIS_PORT_TEST || 6379;
process.env.JWT_SECRET = 'test-jwt-secret-key';
process.env.ENCRYPTION_KEY = '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef';

// Global setup for all tests
beforeAll(async () => {
  // Connect to test database
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to test database');
  } catch (error) {
    console.warn('MongoDB not available for testing. Some tests will be skipped.');
  }
});

// Clean database after each test
afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});

// Close connection after all tests
afterAll(async () => {
  await mongoose.connection.close();
  console.log('Test database connection closed');
});

// Global test utilities
global.testUtils = {
  // Create test user data
  createTestUser: () => ({
    email: `test${Date.now()}@example.com`,
    password: 'Test123!',
    firstName: 'Test',
    lastName: 'User'
  }),

  // Create test challenge data
  createTestChallenge: (userId) => ({
    userId,
    accountSize: 10000,
    accountType: 'balance-based',
    phase: 1,
    status: 'pending',
    initialBalance: 10000,
    profitTarget: 1000,
    maxDrawdown: 1000,
    dailyDrawdownLimit: 500
  }),

  // Wait helper
  sleep: (ms) => new Promise(resolve => setTimeout(resolve, ms))
};
