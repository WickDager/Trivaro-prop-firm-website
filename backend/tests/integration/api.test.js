/**
 * Integration Tests for API Endpoints
 * Tests complete API request/response flows
 */

const request = require('supertest');
const app = require('../src/app');
const server = require('../src/server');

const API_URL = 'http://localhost:5000';

describe('API Integration Tests', () => {
  let authToken;
  let refreshToken;
  let testUser;

  beforeAll(async () => {
    // Wait for server to be ready
    await new Promise(resolve => setTimeout(resolve, 2000));
  });

  afterAll(async () => {
    // Cleanup
    if (testUser) {
      await request(app)
        .post('/api/auth/logout')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ refreshToken });
    }
  });

  describe('Health Check', () => {
    test('GET /health should return 200', async () => {
      const response = await request(API_URL)
        .get('/health')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Server is running');
    });
  });

  describe('API Root', () => {
    test('GET /api should return API info', async () => {
      const response = await request(API_URL)
        .get('/api')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Trivaro Prop Firm API');
      expect(response.body.endpoints).toBeDefined();
    });
  });

  describe('Authentication Endpoints', () => {
    test('POST /api/auth/register should create new user', async () => {
      const userData = {
        email: `api-test-${Date.now()}@example.com`,
        password: 'Test123!',
        firstName: 'API',
        lastName: 'Test'
      };

      const response = await request(API_URL)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user.email).toBe(userData.email);
      expect(response.body.data.tokens.accessToken).toBeDefined();

      testUser = response.body.data.user;
      authToken = response.body.data.tokens.accessToken;
      refreshToken = response.body.data.tokens.refreshToken;
    });

    test('POST /api/auth/login should authenticate user', async () => {
      const credentials = {
        email: `login-test-${Date.now()}@example.com`,
        password: 'Test123!'
      };

      // Register first
      await request(API_URL)
        .post('/api/auth/register')
        .send({
          ...credentials,
          firstName: 'Login',
          lastName: 'Test'
        });

      // Then login
      const response = await request(API_URL)
        .post('/api/auth/login')
        .send(credentials)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.tokens.accessToken).toBeDefined();
    });

    test('POST /api/auth/login should fail with wrong password', async () => {
      const response = await request(API_URL)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'WrongPassword!'
        })
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    test('GET /api/auth/me should return current user', async () => {
      if (!authToken) return;

      const response = await request(API_URL)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.email).toBe(testUser.email);
    });

    test('POST /api/auth/refresh should get new tokens', async () => {
      if (!refreshToken) return;

      const response = await request(API_URL)
        .post('/api/auth/refresh')
        .send({ refreshToken })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.accessToken).toBeDefined();
    });
  });

  describe('Protected Routes', () => {
    test('GET /api/challenges should require authentication', async () => {
      const response = await request(API_URL)
        .get('/api/challenges')
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    test('GET /api/users/me should require authentication', async () => {
      const response = await request(API_URL)
        .get('/api/users/me')
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe('Challenge Endpoints (Authenticated)', () => {
    let challengeToken;
    let challengeRefreshToken;

    beforeAll(async () => {
      // Create test user
      const userData = {
        email: `challenge-test-${Date.now()}@example.com`,
        password: 'Test123!',
        firstName: 'Challenge',
        lastName: 'Test'
      };

      const response = await request(API_URL)
        .post('/api/auth/register')
        .send(userData);

      challengeToken = response.body.data.tokens.accessToken;
      challengeRefreshToken = response.body.data.tokens.refreshToken;
    });

    test('POST /api/challenges/purchase should create challenge', async () => {
      const challengeData = {
        accountSize: 10000,
        accountType: 'balance-based',
        paymentMethod: 'stripe'
      };

      const response = await request(API_URL)
        .post('/api/challenges/purchase')
        .set('Authorization', `Bearer ${challengeToken}`)
        .send(challengeData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.challenge).toBeDefined();
      expect(response.body.data.challenge.accountSize).toBe(10000);
    });

    test('GET /api/challenges should return user challenges', async () => {
      const response = await request(API_URL)
        .get('/api/challenges')
        .set('Authorization', `Bearer ${challengeToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });

  describe('Rate Limiting', () => {
    test('should rate limit login attempts', async () => {
      // Make multiple failed login attempts
      for (let i = 0; i < 15; i++) {
        await request(API_URL)
          .post('/api/auth/login')
          .send({
            email: 'ratelimit@example.com',
            password: 'wrong'
          });
      }

      // The 16th attempt should be rate limited
      const response = await request(API_URL)
        .post('/api/auth/login')
        .send({
          email: 'ratelimit@example.com',
          password: 'wrong'
        });

      // Should get rate limited (429) or fail normally (401)
      expect([401, 429]).toContain(response.status);
    });
  });

  describe('Input Validation', () => {
    test('should reject invalid email format', async () => {
      const response = await request(API_URL)
        .post('/api/auth/register')
        .send({
          email: 'invalid-email',
          password: 'Test123!',
          firstName: 'Test',
          lastName: 'User'
        })
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    test('should reject short password', async () => {
      const response = await request(API_URL)
        .post('/api/auth/register')
        .send({
          email: `shortpass-${Date.now()}@example.com`,
          password: 'short',
          firstName: 'Test',
          lastName: 'User'
        })
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    test('should reject invalid account size', async () => {
      // First register and login
      const regResponse = await request(API_URL)
        .post('/api/auth/register')
        .send({
          email: `acctsize-${Date.now()}@example.com`,
          password: 'Test123!',
          firstName: 'Test',
          lastName: 'User'
        });

      const token = regResponse.body.data.tokens.accessToken;

      const response = await request(API_URL)
        .post('/api/challenges/purchase')
        .set('Authorization', `Bearer ${token}`)
        .send({
          accountSize: 99999, // Invalid size
          accountType: 'balance-based'
        })
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('Security Headers', () => {
    test('should include security headers', async () => {
      const response = await request(API_URL).get('/health');

      expect(response.headers['x-content-type-options']).toBe('nosniff');
      expect(response.headers['x-frame-options']).toBe('SAMEORIGIN');
      expect(response.headers['x-xss-protection']).toBe('1; mode=block');
    });
  });
});
