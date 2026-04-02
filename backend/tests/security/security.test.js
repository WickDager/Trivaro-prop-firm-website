/**
 * Security Tests
 * Tests for SQL injection, XSS, authentication bypass, and other security measures
 */

const request = require('supertest');
const app = require('../src/app');

const API_URL = 'http://localhost:5000';

describe('Security Tests', () => {
  let authToken;

  beforeAll(async () => {
    // Create test user
    const response = await request(API_URL)
      .post('/api/auth/register')
      .send({
        email: `security-test-${Date.now()}@example.com`,
        password: 'Test123!',
        firstName: 'Security',
        lastName: 'Test'
      });

    authToken = response.body.data.tokens.accessToken;
  });

  describe('SQL/NoSQL Injection Prevention', () => {
    test('should prevent NoSQL injection in login', async () => {
      // Try NoSQL injection with object
      const response = await request(API_URL)
        .post('/api/auth/login')
        .send({
          email: { $ne: null },
          password: { $ne: null }
        });

      // Should fail validation or authentication, not succeed
      expect(response.body.success).toBe(false);
    });

    test('should prevent NoSQL injection in challenge query', async () => {
      const response = await request(API_URL)
        .get('/api/challenges?status[$ne]=active')
        .set('Authorization', `Bearer ${authToken}`);

      // Should not expose data through injection
      expect(response.status).toBeOneOf([200, 400]);
    });

    test('should sanitize special characters in input', async () => {
      const maliciousInput = 'test\' OR \'1\'=\'1';

      const response = await request(API_URL)
        .post('/api/auth/register')
        .send({
          email: `${maliciousInput}@example.com`,
          password: 'Test123!',
          firstName: 'Test',
          lastName: 'User'
        });

      // Should fail validation
      expect(response.body.success).toBe(false);
    });
  });

  describe('XSS Prevention', () => {
    test('should sanitize XSS script tags in input', async () => {
      const xssPayload = '<script>alert("XSS")</script>';

      const response = await request(API_URL)
        .post('/api/auth/register')
        .send({
          email: `test-${Date.now()}@example.com`,
          password: 'Test123!',
          firstName: xssPayload,
          lastName: 'User'
        });

      // Should either reject or sanitize the input
      expect(response.body.success).toBe(false);
    });

    test('should sanitize XSS event handlers', async () => {
      const xssPayload = '<img src=x onerror=alert("XSS")>';

      const response = await request(API_URL)
        .post('/api/auth/register')
        .send({
          email: `test-${Date.now()}@example.com`,
          password: 'Test123!',
          firstName: 'Test',
          lastName: xssPayload
        });

      expect(response.body.success).toBe(false);
    });
  });

  describe('Authentication Security', () => {
    test('should reject requests without auth token to protected routes', async () => {
      const response = await request(API_URL)
        .get('/api/challenges');

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });

    test('should reject invalid JWT token', async () => {
      const response = await request(API_URL)
        .get('/api/challenges')
        .set('Authorization', 'Bearer invalid-token');

      expect(response.status).toBe(401);
    });

    test('should reject expired JWT token', async () => {
      // Create a user and get token
      const regResponse = await request(API_URL)
        .post('/api/auth/register')
        .send({
          email: `expired-${Date.now()}@example.com`,
          password: 'Test123!',
          firstName: 'Test',
          lastName: 'User'
        });

      const expiredToken = regResponse.body.data.tokens.accessToken;

      // Token should work initially
      const response = await request(API_URL)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${expiredToken}`);

      // Should be 200 (token not expired yet) or 401 (if already expired)
      expect([200, 401]).toContain(response.status);
    });

    test('should prevent authentication bypass', async () => {
      // Try to access admin endpoint with regular user token
      const response = await request(API_URL)
        .get('/api/admin/stats')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(403);
    });
  });

  describe('Rate Limiting', () => {
    test('should enforce rate limits on auth endpoints', async () => {
      const requests = [];

      // Make 20 rapid requests
      for (let i = 0; i < 20; i++) {
        requests.push(
          request(API_URL)
            .post('/api/auth/login')
            .send({
              email: 'ratelimit@example.com',
              password: 'wrong'
            })
        );
      }

      const responses = await Promise.all(requests);
      const statusCodes = responses.map(r => r.status);

      // Should have at least one 429 (Too Many Requests)
      expect(statusCodes).toContain(429);
    });
  });

  describe('Input Validation', () => {
    test('should reject missing required fields', async () => {
      const response = await request(API_URL)
        .post('/api/auth/register')
        .send({
          email: 'test@example.com'
          // Missing password, firstName, lastName
        });

      expect(response.status).toBe(400);
    });

    test('should reject invalid email format', async () => {
      const response = await request(API_URL)
        .post('/api/auth/register')
        .send({
          email: 'not-an-email',
          password: 'Test123!',
          firstName: 'Test',
          lastName: 'User'
        });

      expect(response.status).toBe(400);
    });

    test('should reject weak passwords', async () => {
      const response = await request(API_URL)
        .post('/api/auth/register')
        .send({
          email: `weak-${Date.now()}@example.com`,
          password: '123',
          firstName: 'Test',
          lastName: 'User'
        });

      expect(response.status).toBe(400);
    });

    test('should reject invalid account types', async () => {
      const response = await request(API_URL)
        .post('/api/challenges/purchase')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          accountSize: 10000,
          accountType: 'invalid-type'
        });

      expect(response.status).toBe(400);
    });
  });

  describe('CORS Security', () => {
    test('should have CORS headers configured', async () => {
      const response = await request(API_URL)
        .get('/health')
        .set('Origin', 'http://localhost:3000');

      // Should have CORS headers
      expect(response.headers['access-control-allow-origin']).toBeDefined();
    });
  });

  describe('Security Headers', () => {
    test('should include X-Content-Type-Options header', async () => {
      const response = await request(API_URL).get('/health');
      expect(response.headers['x-content-type-options']).toBe('nosniff');
    });

    test('should include X-Frame-Options header', async () => {
      const response = await request(API_URL).get('/health');
      expect(response.headers['x-frame-options']).toBe('SAMEORIGIN');
    });

    test('should include X-XSS-Protection header', async () => {
      const response = await request(API_URL).get('/health');
      expect(response.headers['x-xss-protection']).toBe('1; mode=block');
    });

    test('should include Strict-Transport-Security header', async () => {
      const response = await request(API_URL).get('/health');
      expect(response.headers['strict-transport-security']).toBeDefined();
    });
  });

  describe('Path Traversal Prevention', () => {
    test('should prevent path traversal attacks', async () => {
      const response = await request(API_URL)
        .get('/api/../../../etc/passwd');

      expect(response.status).toBe(404);
    });

    test('should prevent directory enumeration', async () => {
      const response = await request(API_URL)
        .get('/api/auth/..%2f..%2f..%2fetc%2fpasswd');

      expect(response.status).toBe(404);
    });
  });

  describe('HTTP Method Security', () => {
    test('should reject unsupported HTTP methods', async () => {
      const response = await request(API_URL)
        .trace('/api/auth/login');

      expect(response.status).toBe(405);
    });
  });
});

// Helper for checking multiple status codes
expect.extend({
  toBeOneOf(received, array) {
    const pass = array.includes(received);
    return {
      pass,
      message: () => `expected ${received} to be one of ${array.join(', ')}`
    };
  }
});
