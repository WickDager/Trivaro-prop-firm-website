# Trivaro Prop Firm - What You Should See

## ✅ When Backend is Running Successfully

### 1. Health Check Endpoint

**URL:** http://localhost:5000/health

**Expected Response:**
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2026-04-01T07:08:52.641Z"
}
```

**Status Code:** 200 OK

---

### 2. API Root Endpoint

**URL:** http://localhost:5000/api

**Expected Response:**
```json
{
  "success": true,
  "message": "Trivaro Prop Firm API",
  "version": "1.0.0",
  "endpoints": {
    "auth": "/api/auth",
    "users": "/api/users",
    "challenges": "/api/challenges",
    "payments": "/api/payments",
    "notifications": "/api/notifications",
    "admin": "/api/admin"
  }
}
```

---

### 3. Backend Logs (Docker)

**Command:** `docker logs trivaro-backend`

**Expected Output:**
```
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   🚀 Trivaro Prop Firm Backend Server                     ║
║                                                           ║
║   Server running on port 5000                            ║
║   Environment: development                             ║
║   API: http://localhost:5000/api                         ║
║   Health: http://localhost:5000/health                   ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝

2026-04-01 07:06:13 info: Redis connected successfully
2026-04-01 07:06:13 info: Redis is ready to accept commands
2026-04-01 07:06:13 info: MongoDB Connected: mongodb
2026-04-01 07:06:13 info: Starting scheduled jobs...
2026-04-01 07:06:13 info: Sync trades job started (every 5 minutes)
2026-04-01 07:06:13 info: Check rules job started (every 10 minutes)
2026-04-01 07:06:13 info: Reset daily drawdown job started (midnight UTC)
2026-04-01 07:06:13 info: Delete expired accounts job started (every 6 hours)
```

---

### 4. Container Status

**Command:** `docker ps --filter "name=trivaro"`

**Expected Output:**
```
CONTAINER ID   IMAGE                    COMMAND                  CREATED         STATUS                   PORTS
NAMES
xxxxx   docker-frontend:latest   "/docker-entrypoint.…"   2 minutes ago   Up 2 minutes           0.0.0.0:3000->80/tcp
trivaro-frontend
xxxxx   docker-backend:latest    "docker-entrypoint.s…"   2 minutes ago   Up 2 minutes (healthy) 0.0.0.0:5000-5001->5000-5001/tcp
trivaro-backend
xxxxx   redis:7-alpine           "docker-entrypoint.s…"   2 minutes ago   Up 2 minutes (healthy) 0.0.0.0:6379->6379/tcp
trivaro-redis
xxxxx   mongo:6.0                "docker-entrypoint.s…"   2 minutes ago   Up 2 minutes (healthy) 0.0.0.0:27017->27017/tcp
trivaro-mongodb
```

All containers should show:
- **STATUS:** Up and running
- **HEALTH:** healthy (after initial health check period)

---

### 5. Frontend (http://localhost:3000)

You should see:
- **Hero Section:** "Become a Funded Trader" headline
- **Account Size Cards:** $5K, $10K, $25K, $50K, $100K with prices
- **Features Section:** High Profit Split, Secure Platform, Instant Funding, etc.
- **Navigation:** Home, How It Works, FAQ, Login, Get Started buttons
- **Footer:** Quick links, Legal links, Copyright

---

### 6. Database Connections

**MongoDB:** localhost:27017
- Database: trivaro
- Collections: users, challenges, trades, transactions, payouts, notifications, auditlogs

**Redis:** localhost:6379
- Used for: Session storage, token blacklist, caching

---

## 🧪 Running Tests

### Quick Start - Run All Tests

```bash
cd backend
npm test
```

### Run Specific Test Categories

```bash
# Unit Tests (Encryption, Auth, Rule Engine)
npm run test:unit

# Integration Tests (API Endpoints)
npm run test:integration

# Security Tests (SQL Injection, XSS, Rate Limiting)
npm run test:security

# Database Tests (Models, Data Integrity)
npm run test:database

# Payment Tests (Stripe, PayPal, Refunds)
npm run test:payment

# With Coverage Report
npm run test:coverage
```

### Test Output Example

```
PASS  tests/unit/encryptionService.test.js
  Encryption Service - Unit Tests
    ✓ should encrypt plain text successfully (5ms)
    ✓ should decrypt encrypted text to original (2ms)
    ✓ should create SHA-256 hash (1ms)
    ✓ should generate random token (1ms)

PASS  tests/unit/ruleEngine.test.js
  Rule Engine - Unit Tests
    ✓ should pass when balance is above max drawdown limit (3ms)
    ✓ should fail when balance is below max drawdown limit (2ms)
    ✓ should update highestEquity when current is higher (1ms)

PASS  tests/security/security.test.js
  Security Tests
    ✓ should prevent NoSQL injection in login (15ms)
    ✓ should sanitize XSS script tags in input (12ms)
    ✓ should enforce rate limits on auth endpoints (85ms)
    ✓ should reject invalid JWT token (8ms)
    ✓ should include security headers (5ms)

Test Suites: 5 passed, 5 total
Tests:       47 passed, 47 total
Snapshots:   0 total
Time:        8.524s
```

---

## 🔐 Security Measures Implemented

### 1. **SQL/NoSQL Injection Prevention**
- ✅ MongoDB driver with parameterized queries
- ✅ express-mongo-sanitize middleware
- ✅ Input validation with Joi schemas
- ✅ No raw queries

### 2. **XSS Prevention**
- ✅ xss-clean middleware
- ✅ Output encoding
- ✅ Content Security Policy headers

### 3. **Authentication Security**
- ✅ JWT with refresh token rotation
- ✅ bcrypt password hashing (10 rounds)
- ✅ Token expiration (7 days access, 30 days refresh)
- ✅ Token blacklist on logout (Redis)

### 4. **Rate Limiting**
- ✅ 100 requests per 15 minutes (general API)
- ✅ 10 login attempts per 15 minutes
- ✅ 20 payment requests per hour

### 5. **Security Headers**
```
Strict-Transport-Security: max-age=31536000
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Content-Security-Policy: default-src 'self'
```

### 6. **Data Encryption**
- ✅ AES-256-CBC for sensitive data (MT4/MT5 credentials)
- ✅ Secure key storage in environment variables
- ✅ Encrypted data at rest

### 7. **Input Validation**
- ✅ Joi schema validation for all inputs
- ✅ Email format validation
- ✅ Password strength requirements
- ✅ Account size enum validation

### 8. **Session Management**
- ✅ HTTP-only secure cookies
- ✅ CSRF token protection
- ✅ Session timeout (24 hours)

---

## 📊 Test Coverage Summary

| Category | Tests | Coverage Goal |
|----------|-------|---------------|
| Unit Tests | 20+ | 80% lines |
| Integration Tests | 15+ | 75% branches |
| Security Tests | 12+ | 100% security critical |
| Database Tests | 10+ | 85% functions |
| Payment Tests | 8+ | 90% payment logic |
| **Total** | **65+** | **80% overall** |

---

## 🚨 Common Issues & Solutions

### Backend Won't Start

**Problem:** Container keeps restarting

**Solution:**
```bash
# Check logs
docker logs trivaro-backend

# Usually MongoDB/Redis not ready yet
docker restart trivaro-mongodb trivaro-redis
docker restart trivaro-backend
```

### Tests Fail to Connect

**Problem:** MongoDB connection error in tests

**Solution:**
```bash
# Start test database
docker run -d --name trivaro-test-mongo -p 27018:27017 mongo:6.0

# Set test environment
export MONGODB_URI=mongodb://localhost:27018/trivaro_test

# Run tests
npm test
```

### Port Already in Use

**Problem:** EADDRINUSE error

**Solution:**
```bash
# Find and kill process
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Or change port in .env
PORT=5001
```

---

## 📝 API Testing Examples

### Register New User

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!",
    "firstName": "Test",
    "lastName": "User"
  }'
```

### Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!"
  }'
```

### Get User Challenges (Authenticated)

```bash
curl -X GET http://localhost:5000/api/challenges \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Purchase Challenge

```bash
curl -X POST http://localhost:5000/api/challenges/purchase \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "accountSize": 10000,
    "accountType": "balance-based",
    "paymentMethod": "stripe"
  }'
```

---

## 🎯 Success Checklist

- [ ] Backend health returns 200
- [ ] Frontend loads at localhost:3000
- [ ] MongoDB connected (check logs)
- [ ] Redis connected (check logs)
- [ ] All 4 containers running (docker ps)
- [ ] Can register new user
- [ ] Can login successfully
- [ ] All tests pass (npm test)
- [ ] Security tests pass
- [ ] Rate limiting works
- [ ] No console errors in browser

---

## 📞 Support

If you encounter issues:

1. Check backend logs: `docker logs trivaro-backend`
2. Check container status: `docker ps -a`
3. Review test output for specific errors
4. Contact: dev@trivaro.com
