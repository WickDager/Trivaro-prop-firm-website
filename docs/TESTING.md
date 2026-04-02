# Trivaro Prop Firm - Test Documentation

## Overview

This document explains how to run the comprehensive test suite for the Trivaro Prop Firm platform.

## Test Categories

### 1. **Unit Tests** (`tests/unit/`)
- Rule Engine tests
- Encryption Service tests
- Auth Service tests
- Utility function tests

### 2. **Integration Tests** (`tests/integration/`)
- API endpoint tests
- Database integration tests
- Payment processing tests

### 3. **Security Tests** (`tests/security/`)
- SQL/NoSQL injection prevention
- XSS prevention
- Authentication security
- Rate limiting
- Input validation
- Security headers

### 4. **Database Tests** (`tests/database/`)
- Model validation
- Data integrity
- Index performance
- Cascade operations

### 5. **Payment Tests** (`tests/payment/`)
- Payment processing
- Refund handling
- Webhook security
- Transaction recording

---

## Running Tests

### Prerequisites

1. **Start Test Database**
```bash
# MongoDB for testing (separate from dev database)
docker run -d --name trivaro-test-mongo -p 27018:27017 mongo:6.0

# Redis for testing
docker run -d --name trivaro-test-redis -p 6380:6379 redis:7-alpine
```

2. **Set Test Environment Variables**
```bash
# Create or update backend/.env.test
MONGODB_URI=mongodb://localhost:27018/trivaro_test
REDIS_HOST=localhost
REDIS_PORT=6380
NODE_ENV=test
```

### Run All Tests

```bash
cd backend
npm test
```

### Run Specific Test Categories

```bash
# Unit tests only
npm run test:unit

# Integration tests only
npm run test:integration

# Security tests only
npm run test:security

# Database tests only
npm run test:database

# Payment tests only
npm run test:payment
```

### Run Tests with Coverage

```bash
# Generate coverage report
npm run test:coverage

# View coverage in browser
open backend/coverage/index.html
```

### Run Tests in Watch Mode

```bash
# Watch for file changes
npm run test:watch
```

---

## Test Results

### Expected Output

```
PASS  tests/unit/encryptionService.test.js
  Encryption Service - Unit Tests
    ✓ should encrypt plain text successfully (5ms)
    ✓ should decrypt encrypted text to original (2ms)
    ✓ should create SHA-256 hash (1ms)

PASS  tests/unit/ruleEngine.test.js
  Rule Engine - Unit Tests
    ✓ should pass when balance is above max drawdown limit (3ms)
    ✓ should fail when balance is below max drawdown limit (2ms)

PASS  tests/security/security.test.js
  Security Tests
    ✓ should prevent NoSQL injection in login (10ms)
    ✓ should sanitize XSS script tags in input (8ms)
    ✓ should enforce rate limits on auth endpoints (50ms)

Test Suites: 5 passed, 5 total
Tests:       45 passed, 45 total
Snapshots:   0 total
Time:        5.234s
```

---

## Security Test Details

### SQL/NoSQL Injection Tests

Tests verify that the application:
- Rejects MongoDB operator injection (`$ne`, `$gt`, etc.)
- Sanitizes special characters in input
- Uses parameterized queries

```javascript
// Example injection attempt (should fail)
{
  email: { $ne: null },
  password: { $ne: null }
}
```

### XSS Prevention Tests

Tests verify that the application:
- Sanitizes `<script>` tags
- Removes event handlers (`onerror`, `onclick`)
- Escapes HTML entities

```javascript
// Example XSS attempts (should be sanitized)
'<script>alert("XSS")</script>'
'<img src=x onerror=alert("XSS")>'
```

### Rate Limiting Tests

Tests verify that the application:
- Limits login attempts (10 per 15 minutes)
- Limits API requests (100 per 15 minutes)
- Returns 429 status when limit exceeded

### Authentication Security Tests

Tests verify that the application:
- Requires JWT tokens for protected routes
- Rejects expired tokens
- Prevents authentication bypass
- Enforces role-based access control

---

## API Testing with Postman/Insomnia

### Import Collection

Import the Postman collection from `tests/api/Trivaro-API.postman_collection.json`

### Test Authentication Flow

1. **Register User**
```http
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "Test123!",
  "firstName": "Test",
  "lastName": "User"
}
```

2. **Login**
```http
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "Test123!"
}
```

3. **Use Access Token**
```http
GET http://localhost:5000/api/challenges
Authorization: Bearer YOUR_ACCESS_TOKEN
```

---

## Load Testing

### Using Artillery

```bash
# Install artillery
npm install -g artillery

# Run load test
artillery run tests/load/challenge-purchase.yml
```

### Load Test Scenarios

1. **User Registration Load Test**
   - 100 concurrent users
   - 5 minutes duration
   - Target: /api/auth/register

2. **Challenge Purchase Load Test**
   - 50 concurrent users
   - 10 minutes duration
   - Target: /api/challenges/purchase

---

## Continuous Integration

### GitHub Actions

Tests run automatically on:
- Every pull request
- Every push to main branch
- Scheduled daily security scans

### Local Pre-commit Hook

```bash
# Install husky for git hooks
npm install husky --save-dev
npx husky install

# Add pre-commit test hook
npx husky add .husky/pre-commit "npm test"
```

---

## Troubleshooting

### Tests Fail to Connect to Database

```bash
# Check MongoDB is running
docker ps | grep mongo

# Restart test database
docker restart trivaro-test-mongo
```

### Tests Timeout

```bash
# Increase timeout in jest.config.js
{
  "testTimeout": 30000
}
```

### Port Already in Use

```bash
# Find process using port
netstat -ano | findstr :27017

# Kill process
taskkill /PID <PID> /F
```

---

## Test Coverage Goals

| Category | Target | Current |
|----------|--------|---------|
| Lines | 80% | - |
| Functions | 85% | - |
| Branches | 75% | - |
| Statements | 80% | - |

---

## Security Checklist

- [x] SQL/NoSQL injection prevention
- [x] XSS prevention
- [x] CSRF protection
- [x] Rate limiting
- [x] Input validation
- [x] Authentication enforcement
- [x] Authorization checks
- [x] Security headers
- [x] Password hashing
- [x] Data encryption
- [x] Secure token generation
- [x] Session management
- [x] Error handling (no info leakage)

---

## Support

For test-related issues:
- Check logs in `backend/logs/test.log`
- Review Jest output for specific errors
- Contact: dev@trivaro.com
