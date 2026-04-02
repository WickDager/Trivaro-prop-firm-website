# Trivaro Prop Firm - API Documentation

## Base URL
```
Development: http://localhost:5000/api
Production: https://api.trivaro.com/api
```

## Authentication

All protected endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <access_token>
```

## Endpoints

### Authentication

#### POST /api/auth/register
Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "user": { ... },
    "tokens": {
      "accessToken": "...",
      "refreshToken": "..."
    }
  }
}
```

#### POST /api/auth/login
Login to existing account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

#### POST /api/auth/logout
Logout and invalidate tokens.

#### POST /api/auth/refresh
Refresh access token.

**Request Body:**
```json
{
  "refreshToken": "..."
}
```

### Challenges

#### GET /api/challenges
Get all user challenges.

**Query Parameters:**
- `status` (optional): Filter by status (active, passed, failed, pending)

#### POST /api/challenges/purchase
Purchase a new challenge.

**Request Body:**
```json
{
  "accountSize": 10000,
  "accountType": "balance-based",
  "paymentMethod": "stripe"
}
```

#### GET /api/challenges/:id
Get challenge details.

#### GET /api/challenges/:id/trades
Get challenge trade history.

#### GET /api/challenges/:id/statistics
Get challenge statistics.

#### GET /api/challenges/:id/equity-history
Get equity history for charts.

**Query Parameters:**
- `days` (optional): Number of days (default: 30)

### Payments

#### POST /api/payments/process
Process payment for challenge.

**Request Body:**
```json
{
  "challengeId": "...",
  "paymentMethod": "stripe",
  "paymentDetails": {
    "paymentMethodId": "pm_..."
  }
}
```

#### GET /api/payments/transactions
Get user transaction history.

### Notifications

#### GET /api/notifications
Get user notifications.

**Query Parameters:**
- `limit` (optional): Max notifications (default: 50)
- `unreadOnly` (optional): Only unread (default: false)

#### PATCH /api/notifications/:id/read
Mark notification as read.

#### PATCH /api/notifications/read-all
Mark all notifications as read.

### Admin (Admin Only)

#### GET /api/admin/stats
Get dashboard statistics.

#### GET /api/admin/users
Get all users with pagination.

#### PUT /api/admin/users/:id
Update user (role, status, KYC).

#### GET /api/admin/challenges
Get all challenges.

#### GET /api/admin/payouts
Get all payout requests.

#### POST /api/admin/payouts/:id/approve
Approve payout request.

## Error Responses

All errors follow this format:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message"
  }
}
```

### Common Error Codes
- `VALIDATION_ERROR`: Invalid input
- `UNAUTHORIZED`: Missing or invalid token
- `FORBIDDEN`: Insufficient permissions
- `NOT_FOUND`: Resource not found
- `RATE_LIMIT_EXCEEDED`: Too many requests
- `INTERNAL_ERROR`: Server error

## Rate Limits

- General API: 100 requests per 15 minutes
- Auth endpoints: 10 requests per 15 minutes
- Payment endpoints: 20 requests per hour

## WebSocket Events

### Client → Server
- `join-user-room`: Join personal room
- `join-challenge-room`: Join challenge room

### Server → Client
- `trade:update`: New trade or trade update
- `equity:update`: Equity change
- `rule:violation`: Rule violation alert
- `phase:completed`: Phase completion
