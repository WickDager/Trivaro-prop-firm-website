# Trivaro Prop Firm - Complete Development Specification

## Project Overview
Build a full-stack proprietary trading firm platform that evaluates forex traders through a two-phase challenge system using demo accounts from Doprime broker. The platform will automatically manage account creation, monitor trading rules, and provide funded accounts to successful traders.

---

## 1. TECHNOLOGY STACK

### Frontend
- **Framework**: React.js or Next.js
- **Styling**: Tailwind CSS + shadcn/ui components
- **State Management**: Redux Toolkit or Zustand
- **Charts/Analytics**: Recharts or Chart.js
- **Authentication UI**: Custom auth components with JWT

### Backend
- **Framework**: Node.js with Express.js OR Python with FastAPI
- **API Architecture**: RESTful API with WebSocket support for real-time updates
- **Authentication**: JWT (JSON Web Tokens) with refresh token rotation
- **Session Management**: Redis for session storage

### Database
- **Primary Database**: MongoDB (recommended for flexibility) OR PostgreSQL
- **Caching Layer**: Redis
- **Structure**:
  - Users collection/table
  - Accounts collection/table
  - Challenges collection/table
  - Transactions collection/table
  - Trading data collection/table (real-time sync from MT4/MT5)

### Broker Integration
- **Broker**: Doprime (supports MT4/MT5)
- **Integration Method**: MetaTrader API or MetaAPI.cloud
- **Account Types**: Demo accounts only (for evaluation phases)

### Security
- **Encryption**: AES-256 for sensitive data at rest
- **SSL/TLS**: HTTPS everywhere
- **Password Hashing**: bcrypt or Argon2
- **Environment Variables**: All credentials stored in .env files
- **Rate Limiting**: Express-rate-limit or similar
- **Input Validation**: Joi or Zod for request validation
- **SQL Injection Prevention**: Parameterized queries/ORM
- **XSS Prevention**: Content Security Policy headers

---

## 1.5 PROJECT FILE STRUCTURE

### Complete Directory Structure

```
trivaro-prop-firm/
│
├── frontend/                           # React/Next.js frontend application
│   ├── public/
│   │   ├── images/
│   │   │   ├── logo.svg
│   │   │   ├── hero-background.jpg
│   │   │   └── icons/
│   │   ├── favicon.ico
│   │   └── index.html
│   │
│   ├── src/
│   │   ├── components/                 # Reusable UI components
│   │   │   ├── common/
│   │   │   │   ├── Button.jsx
│   │   │   │   ├── Card.jsx
│   │   │   │   ├── Input.jsx
│   │   │   │   ├── Modal.jsx
│   │   │   │   ├── Loader.jsx
│   │   │   │   ├── Navbar.jsx
│   │   │   │   ├── Footer.jsx
│   │   │   │   └── NotificationToast.jsx
│   │   │   │
│   │   │   ├── auth/
│   │   │   │   ├── LoginForm.jsx
│   │   │   │   ├── RegisterForm.jsx
│   │   │   │   ├── ForgotPasswordForm.jsx
│   │   │   │   ├── ResetPasswordForm.jsx
│   │   │   │   └── TwoFactorAuth.jsx
│   │   │   │
│   │   │   ├── dashboard/
│   │   │   │   ├── DashboardOverview.jsx
│   │   │   │   ├── ActiveChallenges.jsx
│   │   │   │   ├── PerformanceMetrics.jsx
│   │   │   │   ├── QuickStatsCard.jsx
│   │   │   │   ├── RecentTrades.jsx
│   │   │   │   └── NotificationCenter.jsx
│   │   │   │
│   │   │   ├── challenge/
│   │   │   │   ├── ChallengeCard.jsx
│   │   │   │   ├── AccountSizeSelector.jsx
│   │   │   │   ├── AccountTypeComparison.jsx
│   │   │   │   ├── EquityChart.jsx
│   │   │   │   ├── RuleStatusIndicator.jsx
│   │   │   │   ├── TradeHistoryTable.jsx
│   │   │   │   ├── StatisticsBreakdown.jsx
│   │   │   │   └── CertificateDisplay.jsx
│   │   │   │
│   │   │   ├── purchase/
│   │   │   │   ├── AccountPricingCard.jsx
│   │   │   │   ├── CheckoutForm.jsx
│   │   │   │   ├── PaymentMethodSelector.jsx
│   │   │   │   └── OrderConfirmation.jsx
│   │   │   │
│   │   │   ├── admin/
│   │   │   │   ├── AdminSidebar.jsx
│   │   │   │   ├── UserManagementTable.jsx
│   │   │   │   ├── ChallengeMonitoringPanel.jsx
│   │   │   │   ├── FinancialDashboard.jsx
│   │   │   │   ├── SystemSettings.jsx
│   │   │   │   ├── AnalyticsCharts.jsx
│   │   │   │   └── SupportTickets.jsx
│   │   │   │
│   │   │   └── charts/
│   │   │       ├── EquityCurveChart.jsx
│   │   │       ├── DailyPLChart.jsx
│   │   │       ├── DrawdownChart.jsx
│   │   │       └── WinRateChart.jsx
│   │   │
│   │   ├── pages/                      # Page components
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── ChallengeDetails.jsx
│   │   │   ├── PurchaseChallenge.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── FAQ.jsx
│   │   │   ├── HowItWorks.jsx
│   │   │   ├── PrivacyPolicy.jsx
│   │   │   ├── TermsOfService.jsx
│   │   │   └── NotFound.jsx
│   │   │
│   │   ├── hooks/                      # Custom React hooks
│   │   │   ├── useAuth.js
│   │   │   ├── useChallenge.js
│   │   │   ├── useWebSocket.js
│   │   │   ├── useNotifications.js
│   │   │   └── usePayment.js
│   │   │
│   │   ├── context/                    # React Context providers
│   │   │   ├── AuthContext.jsx
│   │   │   ├── ChallengeContext.jsx
│   │   │   ├── ThemeContext.jsx
│   │   │   └── NotificationContext.jsx
│   │   │
│   │   ├── services/                   # API service functions
│   │   │   ├── api.js                  # Axios instance configuration
│   │   │   ├── authService.js
│   │   │   ├── challengeService.js
│   │   │   ├── paymentService.js
│   │   │   ├── userService.js
│   │   │   ├── adminService.js
│   │   │   └── websocketService.js
│   │   │
│   │   ├── utils/                      # Utility functions
│   │   │   ├── formatters.js           # Date, number, currency formatters
│   │   │   ├── validators.js           # Input validation functions
│   │   │   ├── constants.js            # App constants
│   │   │   ├── helpers.js              # Helper functions
│   │   │   └── calculations.js         # Trading calculations
│   │   │
│   │   ├── store/                      # Redux/Zustand store (if using)
│   │   │   ├── index.js
│   │   │   ├── slices/
│   │   │   │   ├── authSlice.js
│   │   │   │   ├── challengeSlice.js
│   │   │   │   ├── userSlice.js
│   │   │   │   └── notificationSlice.js
│   │   │   └── middleware/
│   │   │       └── api.js
│   │   │
│   │   ├── styles/                     # Global styles
│   │   │   ├── globals.css
│   │   │   ├── tailwind.css
│   │   │   └── variables.css
│   │   │
│   │   ├── App.jsx                     # Main App component
│   │   ├── index.jsx                   # Entry point
│   │   └── routes.jsx                  # Route definitions
│   │
│   ├── .env.example
│   ├── .gitignore
│   ├── package.json
│   ├── tailwind.config.js
│   ├── vite.config.js (or next.config.js)
│   └── README.md
│
├── backend/                            # Node.js/Express backend
│   ├── src/
│   │   ├── config/                     # Configuration files
│   │   │   ├── database.js             # MongoDB/PostgreSQL connection
│   │   │   ├── redis.js                # Redis connection
│   │   │   ├── jwt.js                  # JWT configuration
│   │   │   ├── email.js                # Email service config (SendGrid/Nodemailer)
│   │   │   ├── payment.js              # Stripe/PayPal config
│   │   │   └── broker.js               # Doprime/MetaAPI config
│   │   │
│   │   ├── models/                     # Database models
│   │   │   ├── User.js
│   │   │   ├── Challenge.js
│   │   │   ├── Trade.js
│   │   │   ├── Transaction.js
│   │   │   ├── Payout.js
│   │   │   ├── Notification.js
│   │   │   └── AuditLog.js
│   │   │
│   │   ├── controllers/                # Request handlers
│   │   │   ├── authController.js
│   │   │   ├── userController.js
│   │   │   ├── challengeController.js
│   │   │   ├── tradeController.js
│   │   │   ├── paymentController.js
│   │   │   ├── payoutController.js
│   │   │   ├── adminController.js
│   │   │   └── webhookController.js
│   │   │
│   │   ├── routes/                     # API routes
│   │   │   ├── auth.routes.js
│   │   │   ├── user.routes.js
│   │   │   ├── challenge.routes.js
│   │   │   ├── trade.routes.js
│   │   │   ├── payment.routes.js
│   │   │   ├── payout.routes.js
│   │   │   ├── admin.routes.js
│   │   │   └── webhook.routes.js
│   │   │
│   │   ├── middleware/                 # Express middleware
│   │   │   ├── auth.middleware.js      # JWT verification
│   │   │   ├── validation.middleware.js # Request validation
│   │   │   ├── error.middleware.js     # Error handling
│   │   │   ├── rateLimit.middleware.js # Rate limiting
│   │   │   ├── cors.middleware.js      # CORS configuration
│   │   │   ├── admin.middleware.js     # Admin-only routes
│   │   │   └── upload.middleware.js    # File upload handling
│   │   │
│   │   ├── services/                   # Business logic services
│   │   │   ├── authService.js          # Authentication logic
│   │   │   ├── challengeService.js     # Challenge management
│   │   │   ├── brokerService.js        # Doprime/MetaAPI integration
│   │   │   ├── ruleEngine.js           # Trading rule validation
│   │   │   ├── paymentService.js       # Payment processing
│   │   │   ├── emailService.js         # Email sending
│   │   │   ├── notificationService.js  # Notification management
│   │   │   ├── encryptionService.js    # Data encryption/decryption
│   │   │   ├── pdfService.js           # PDF generation (invoices, certificates)
│   │   │   └── analyticsService.js     # Analytics and reporting
│   │   │
│   │   ├── validators/                 # Request validation schemas
│   │   │   ├── auth.validator.js
│   │   │   ├── challenge.validator.js
│   │   │   ├── payment.validator.js
│   │   │   └── user.validator.js
│   │   │
│   │   ├── utils/                      # Utility functions
│   │   │   ├── logger.js               # Winston logger
│   │   │   ├── errorHandler.js         # Custom error classes
│   │   │   ├── asyncHandler.js         # Async route wrapper
│   │   │   ├── calculations.js         # Trading calculations
│   │   │   └── helpers.js              # General helpers
│   │   │
│   │   ├── jobs/                       # Scheduled jobs (Cron)
│   │   │   ├── syncTrades.job.js       # Sync trades from broker
│   │   │   ├── checkRules.job.js       # Check trading rules
│   │   │   ├── deleteAccounts.job.js   # Delete expired accounts
│   │   │   ├── resetDailyLimits.job.js # Reset daily drawdown
│   │   │   ├── generateReports.job.js  # Daily reports
│   │   │   └── scheduler.js            # Cron scheduler setup
│   │   │
│   │   ├── websocket/                  # WebSocket handlers
│   │   │   ├── socketServer.js         # Socket.io setup
│   │   │   ├── tradeEvents.js          # Real-time trade events
│   │   │   ├── challengeEvents.js      # Challenge status updates
│   │   │   └── notificationEvents.js   # Live notifications
│   │   │
│   │   ├── templates/                  # Email templates
│   │   │   ├── welcome.html
│   │   │   ├── credentials.html
│   │   │   ├── phasePass.html
│   │   │   ├── phaseFail.html
│   │   │   ├── ruleViolation.html
│   │   │   ├── payout.html
│   │   │   └── invoice.html
│   │   │
│   │   ├── app.js                      # Express app setup
│   │   └── server.js                   # Server entry point
│   │
│   ├── tests/                          # Test files
│   │   ├── unit/
│   │   │   ├── auth.test.js
│   │   │   ├── challenge.test.js
│   │   │   ├── ruleEngine.test.js
│   │   │   └── payment.test.js
│   │   │
│   │   ├── integration/
│   │   │   ├── api.test.js
│   │   │   ├── broker.test.js
│   │   │   └── database.test.js
│   │   │
│   │   └── e2e/
│   │       └── userFlow.test.js
│   │
│   ├── .env.example
│   ├── .gitignore
│   ├── package.json
│   ├── nodemon.json
│   └── README.md
│
├── database/                           # Database scripts
│   ├── migrations/
│   │   ├── 001_create_users.js
│   │   ├── 002_create_challenges.js
│   │   ├── 003_create_trades.js
│   │   └── 004_create_transactions.js
│   │
│   ├── seeds/
│   │   ├── users.seed.js
│   │   └── challenges.seed.js
│   │
│   └── backup/
│       └── backup.sh
│
├── docker/                             # Docker configuration
│   ├── Dockerfile.frontend
│   ├── Dockerfile.backend
│   └── docker-compose.yml
│
├── nginx/                              # Nginx configuration (if using)
│   ├── nginx.conf
│   └── ssl/
│
├── scripts/                            # Utility scripts
│   ├── deploy.sh
│   ├── backup.sh
│   ├── restore.sh
│   └── setup.sh
│
├── docs/                               # Documentation
│   ├── API.md                          # API documentation
│   ├── DEPLOYMENT.md                   # Deployment guide
│   ├── SECURITY.md                     # Security guidelines
│   └── CONTRIBUTING.md                 # Contribution guidelines
│
├── .gitignore
├── .env.example
├── README.md
└── LICENSE
```

### Key File Descriptions

#### Frontend Core Files

**src/services/api.js** - Axios configuration with interceptors
```javascript
// Configure base URL, headers, auth token injection, error handling
```

**src/services/challengeService.js** - Challenge API calls
```javascript
// getChallenges(), purchaseChallenge(), getChallengeDetails(), etc.
```

**src/components/challenge/EquityChart.jsx** - Real-time equity visualization
```javascript
// Recharts implementation with live WebSocket updates
```

**src/hooks/useWebSocket.js** - WebSocket connection management
```javascript
// Connect, subscribe to events, disconnect
```

#### Backend Core Files

**src/services/ruleEngine.js** - THE MOST CRITICAL FILE
```javascript
// checkDailyDrawdown(), checkMaxDrawdown(), checkProfitTarget()
// validateTrade(), checkConsistencyRule(), etc.
```

**src/services/brokerService.js** - Doprime/MetaAPI integration
```javascript
// createDemoAccount(), deleteDemoAccount(), syncTrades()
// getAccountInfo(), getPositions(), getHistory()
```

**src/jobs/syncTrades.job.js** - Real-time trade synchronization
```javascript
// Runs every 1-5 minutes, fetches new trades, updates database
```

**src/jobs/checkRules.job.js** - Rule violation checking
```javascript
// Runs frequently, checks all active challenges against rules
```

**src/websocket/tradeEvents.js** - Real-time trade broadcasts
```javascript
// Emit trade updates to connected clients
```

**src/middleware/auth.middleware.js** - JWT authentication
```javascript
// verifyToken(), checkRole(), etc.
```

**src/controllers/challengeController.js** - Challenge endpoints
```javascript
// POST /api/challenges (purchase)
// GET /api/challenges/:id (details)
// GET /api/challenges/user/:userId (user's challenges)
```

---

---

## 2. COLOR SCHEME & DESIGN

### Recommended Color Palette (Modern Prop Firm Style)
- **Primary**: Deep Navy Blue (#0A1628) - Trust and professionalism
- **Secondary**: Bright Teal/Cyan (#00D9FF) - Modern, tech-forward
- **Accent**: Electric Green (#00FF88) - Profit/success indicators
- **Error/Loss**: Vibrant Red (#FF3B57) - Loss indicators
- **Background**: Dark charcoal (#0F1419) with subtle gradients
- **Text**: White (#FFFFFF) and light gray (#A0AEC0)
- **Cards**: Semi-transparent dark (#1A1F2E) with glass-morphism effect

### Design Inspiration
- Study websites like: FTMO, The5%ers, MyForexFunds, FundedNext, Naira Trader
- Modern, clean, professional with trading dashboard aesthetics
- Clear data visualization and intuitive navigation
- Mobile-responsive design mandatory

---

## 3. ACCOUNT SIZES & PRICING

### Available Account Sizes
1. **$5,000 Challenge** - Entry level
2. **$10,000 Challenge** - Beginner friendly
3. **$25,000 Challenge** - Intermediate
4. **$50,000 Challenge** - Advanced
5. **$100,000 Challenge** - Professional

### Pricing Structure (Suggested - adjust based on market research)
- $5K: $49-$79
- $10K: $99-$149
- $25K: $199-$299
- $50K: $349-$499
- $100K: $549-$999

---

## 4. ACCOUNT TYPES & TRADING RULES

### 4.1 Balance-Based Drawdown Account

**Concept**: Drawdown calculated only from initial balance, ignoring floating profits/losses

**Phase 1 Rules:**
- Profit Target: 8-10% of initial balance
- Maximum Overall Drawdown: 10% of initial balance (static)
- Daily Drawdown Limit: 5% of initial balance (resets daily at midnight)
- Minimum Trading Days: 5 days
- Time Limit: Unlimited (no pressure)
- Allowed Instruments: Forex pairs, Gold, Indices
- News Trading: Allowed
- Weekend Holding: Allowed
- Expert Advisors (EAs): Allowed

**Phase 2 Rules:**
- Profit Target: 5% of initial balance
- Maximum Overall Drawdown: 10% of initial balance (static)
- Daily Drawdown Limit: 5% of initial balance
- Minimum Trading Days: 5 days
- Time Limit: Unlimited
- All other rules same as Phase 1

**Funded Account Rules:**
- No profit target (trade indefinitely)
- Maximum Overall Drawdown: 10% of initial balance
- Daily Drawdown Limit: 5% of initial balance
- Profit Split: 80% trader / 20% firm (scalable to 90/10)
- Payout Frequency: Bi-weekly or monthly
- Scaling Plan: Available after consistent performance

**Example Calculation ($100,000 Balance-Based Account):**
```
Initial Balance: $100,000
Maximum Drawdown: $90,000 (can never go below this)
Daily Loss Limit: $95,000 (5% = $5,000 daily loss limit)

Scenario:
- Day 1: Close with $103,000 (made $3,000)
- Day 2: Still can only lose down to $95,000 for the day
- Overall drawdown still calculated from initial $100,000
- Even with profits, limits stay STATIC
```

---

### 4.2 Equity-Based Drawdown Account

**Concept**: Drawdown tracks highest equity reached (dynamic/trailing)

**Phase 1 Rules:**
- Profit Target: 8-10% of initial balance
- Maximum Overall Drawdown: 10% from highest equity (trailing)
- Daily Drawdown Limit: 5% from daily starting equity (dynamic)
- Minimum Trading Days: 5 days
- Time Limit: Unlimited
- Consistency Rule: Single day's profit shouldn't exceed 40% of total profits
- Allowed Instruments: Forex pairs, Gold, Indices
- News Trading: Allowed
- Weekend Holding: Allowed
- Expert Advisors (EAs): Allowed

**Phase 2 Rules:**
- Profit Target: 5% of initial balance
- Maximum Overall Drawdown: 10% from highest equity (trailing)
- Daily Drawdown Limit: 5% from daily starting equity
- Minimum Trading Days: 5 days
- Consistency Rule: 40% guideline
- Time Limit: Unlimited

**Funded Account Rules:**
- No profit target
- Maximum Overall Drawdown: 10% from highest equity (trailing)
- Daily Drawdown Limit: 5% from daily starting equity
- Profit Split: 75% trader / 25% firm (scalable to 85/15)
- Payout Frequency: Bi-weekly or monthly

**Example Calculation ($100,000 Equity-Based Account):**
```
Initial Balance: $100,000
Initial Max Drawdown: $90,000

Day 1:
- Close with $105,000 (made $5,000)
- New max drawdown: $94,500 (10% from $105,000)

Day 2: 
- Start with equity: $105,000
- Daily loss limit: $99,750 (5% from $105,000)
- Cannot drop below $99,750 during the day

If equity hits $108,000:
- New max drawdown: $97,200 (trails up)
- Much stricter but rewards consistent growth
```

---

## 5. SYSTEM ARCHITECTURE

### 5.1 User Flow

```
1. User Registration
   ↓
2. Email Verification
   ↓
3. Dashboard Access
   ↓
4. Select Account Size & Type (Balance/Equity based)
   ↓
5. Payment Processing (Stripe/PayPal)
   ↓
6. Automatic Demo Account Creation (Doprime API)
   ↓
7. Credentials Sent via Email (Encrypted)
   ↓
8. Phase 1 Challenge Begins
   ↓
9. Real-time Rule Monitoring
   ↓
10. Pass → Phase 2 OR Fail → Account Deleted After 3 Days
    ↓
11. Phase 2 Challenge
    ↓
12. Pass → Funded Account OR Fail → Retry Option
    ↓
13. Funded Trading with Payouts
```

---

### 5.2 Core Features

#### A. User Management
- **Registration/Login**: Email/password with 2FA option
- **KYC Verification**: Document upload for funded accounts
- **Profile Management**: Update personal info, trading preferences
- **Dashboard**: Overview of all challenges and performance metrics

#### B. Challenge Management System
- **Purchase Flow**: Select account → Choose type → Payment → Confirmation
- **Auto Account Creation**: 
  - Integrate with Doprime API/MetaTrader Manager API
  - Generate unique login credentials
  - Store credentials encrypted in database
  - Send credentials via secure email
  
- **Real-Time Monitoring**:
  - WebSocket connection to MT4/MT5 server
  - Track every trade in real-time
  - Calculate equity, balance, drawdown continuously
  - Check rule violations instantly
  
- **Rule Enforcement Engine**:
  ```javascript
  // Pseudo-code for rule checking
  function checkDailyDrawdown(account) {
    if (account.type === 'balance-based') {
      const limit = account.initialBalance * 0.95;
      return account.balance >= limit;
    } else {
      const dailyStartEquity = account.dailyStartEquity;
      const currentEquity = account.balance + account.floatingPL;
      return currentEquity >= (dailyStartEquity * 0.95);
    }
  }
  
  function checkMaxDrawdown(account) {
    if (account.type === 'balance-based') {
      return account.balance >= (account.initialBalance * 0.90);
    } else {
      const highWaterMark = account.highestEquity;
      const currentEquity = account.balance + account.floatingPL;
      return currentEquity >= (highWaterMark * 0.90);
    }
  }
  ```

- **Automatic Account Deletion**:
  - If rules breached → Mark account for deletion
  - Send notification to user
  - After 3 days → API call to close demo account
  - Archive data for analytics

#### C. Trading Dashboard (For Users)
- **Account Overview**: Current balance, equity, profit/loss
- **Performance Charts**: 
  - Equity curve
  - Daily P&L
  - Win rate
  - Risk metrics
  
- **Rules Display**: 
  - Visual indicators for drawdown limits
  - Progress toward profit targets
  - Days traded
  
- **Trade History**: List of all executed trades
- **Certificates**: Generate certificate on passing each phase

#### D. Admin Panel
- **User Management**: View all users, ban/suspend accounts
- **Challenge Monitoring**: Overview of all active challenges
- **Financial Dashboard**: Revenue, payouts, pending withdrawals
- **Rule Configuration**: Modify rules without code changes
- **Analytics**: 
  - Pass/fail rates
  - Most common violation reasons
  - Popular account sizes
  
- **Support Tickets**: Handle user queries
- **Payout Management**: Approve/process trader withdrawals

#### E. Payment Integration
- **Payment Gateways**: Stripe, PayPal, Cryptocurrency (optional)
- **Checkout Flow**: Secure payment processing
- **Invoice Generation**: Automatic PDF invoices
- **Refund System**: Partial refunds for specific cases

#### F. Notification System
- **Email Notifications**:
  - Welcome email with credentials
  - Daily trading summary
  - Rule violation warnings
  - Phase progression
  - Payout confirmations
  
- **In-App Notifications**: Real-time alerts for important events
- **SMS Notifications** (Optional): Critical alerts

---

## 6. DATABASE SCHEMA

### MongoDB Schema Example

```javascript
// Users Collection
{
  _id: ObjectId,
  email: String,
  passwordHash: String,
  firstName: String,
  lastName: String,
  phone: String,
  country: String,
  kycStatus: String, // 'pending', 'verified', 'rejected'
  kycDocuments: [String], // URLs to uploaded documents
  createdAt: Date,
  updatedAt: Date,
  isActive: Boolean,
  role: String // 'user', 'admin'
}

// Challenges Collection
{
  _id: ObjectId,
  userId: ObjectId,
  accountSize: Number, // 5000, 10000, 25000, 50000, 100000
  accountType: String, // 'balance-based', 'equity-based'
  phase: Number, // 1, 2, or 3 (funded)
  status: String, // 'active', 'passed', 'failed', 'pending'
  
  // Trading account details
  mt4Login: String,
  mt4Password: String, // Encrypted
  mt4Server: String,
  broker: String, // 'doprime'
  
  // Initial parameters
  initialBalance: Number,
  profitTarget: Number,
  maxDrawdown: Number,
  dailyDrawdownLimit: Number,
  
  // Current state
  currentBalance: Number,
  currentEquity: Number,
  highestEquity: Number, // For equity-based trailing
  dailyStartEquity: Number, // Reset daily
  totalProfit: Number,
  totalLoss: Number,
  
  // Performance tracking
  tradingDays: Number,
  totalTrades: Number,
  winningTrades: Number,
  losingTrades: Number,
  largestWin: Number,
  largestLoss: Number,
  
  // Rule tracking
  rulesViolated: [String],
  violationDate: Date,
  
  // Dates
  startDate: Date,
  endDate: Date,
  deletionScheduledDate: Date,
  createdAt: Date,
  updatedAt: Date
}

// Trades Collection
{
  _id: ObjectId,
  challengeId: ObjectId,
  userId: ObjectId,
  ticketNumber: Number,
  symbol: String,
  type: String, // 'buy', 'sell'
  volume: Number,
  openPrice: Number,
  closePrice: Number,
  openTime: Date,
  closeTime: Date,
  profit: Number,
  commission: Number,
  swap: Number,
  comment: String,
  createdAt: Date
}

// Transactions Collection
{
  _id: ObjectId,
  userId: ObjectId,
  challengeId: ObjectId,
  type: String, // 'challenge_purchase', 'payout', 'refund'
  amount: Number,
  currency: String,
  paymentMethod: String,
  paymentStatus: String, // 'pending', 'completed', 'failed'
  paymentGatewayId: String,
  invoiceUrl: String,
  createdAt: Date,
  updatedAt: Date
}

// Payouts Collection
{
  _id: ObjectId,
  userId: ObjectId,
  challengeId: ObjectId,
  requestedAmount: Number,
  approvedAmount: Number,
  status: String, // 'pending', 'approved', 'rejected', 'paid'
  paymentMethod: String,
  paymentDetails: Object, // Bank account, crypto wallet, etc.
  requestDate: Date,
  approvalDate: Date,
  paymentDate: Date,
  notes: String
}
```

---

## 7. DOPRIME INTEGRATION

### MetaTrader API Integration

**Option 1: Direct MT4/MT5 Manager API**
- Connect to Doprime's MT4/MT5 Manager API
- Requires server credentials from Doprime
- Can create demo accounts programmatically
- Real-time access to trading data

**Option 2: MetaAPI Cloud Service (Recommended)**
- Website: https://metaapi.cloud
- Provides REST API and WebSocket for MT4/MT5
- Handles the complexity of MT protocol
- Supports demo account creation
- Real-time trade synchronization
- Pricing: Free tier available, paid plans for production

### Implementation Files & Code

#### File: `backend/src/services/brokerService.js`

```javascript
/**
 * Broker Service - Doprime/MetaAPI Integration
 * Handles all broker-related operations including account creation and trade syncing
 */

const MetaApi = require('metaapi.cloud-sdk').default;
const User = require('../models/User');
const Challenge = require('../models/Challenge');
const Trade = require('../models/Trade');
const logger = require('../utils/logger');
const encryptionService = require('./encryptionService');

class BrokerService {
  constructor() {
    this.api = new MetaApi(process.env.META_API_TOKEN);
    this.provisioningProfile = null;
    this.activeConnections = new Map(); // Store active connections
  }

  /**
   * Initialize provisioning profile for Doprime
   */
  async initializeProvisioningProfile() {
    try {
      const profiles = await this.api.provisioningProfileApi.getProvisioningProfiles();
      this.provisioningProfile = profiles.find(p => p.name === 'Doprime-Profile');
      
      if (!this.provisioningProfile) {
        this.provisioningProfile = await this.api.provisioningProfileApi.createProvisioningProfile({
          name: 'Doprime-Profile',
          version: 5, // MT5
          broker: 'Doprime',
          serverName: process.env.DOPRIME_SERVER_NAME
        });
      }
      
      logger.info('Provisioning profile initialized');
    } catch (error) {
      logger.error('Failed to initialize provisioning profile:', error);
      throw error;
    }
  }

  /**
   * Create demo account for a challenge
   * @param {String} userId - User ID
   * @param {Number} accountSize - Account balance
   * @param {String} accountType - 'balance-based' or 'equity-based'
   * @param {Number} phase - Challenge phase (1 or 2)
   * @returns {Object} Account credentials
   */
  async createDemoAccount(userId, accountSize, accountType, phase) {
    try {
      const user = await User.findById(userId);
      if (!user) throw new Error('User not found');

      if (!this.provisioningProfile) {
        await this.initializeProvisioningProfile();
      }

      // Create demo account via MetaAPI
      const demoAccount = await this.provisioningProfile.createMt5DemoAccount({
        accountType: 'demo',
        balance: accountSize,
        email: user.email,
        leverage: 100, // 1:100 leverage
        serverName: process.env.DOPRIME_SERVER_NAME,
        name: `${user.firstName} ${user.lastName}`,
        phone: user.phone || '+1234567890'
      });

      logger.info(`Demo account created for user ${userId}: ${demoAccount.login}`);

      // Encrypt password before storing
      const encryptedPassword = encryptionService.encrypt(demoAccount.password);

      return {
        login: demoAccount.login,
        password: demoAccount.password, // Plain text for email
        encryptedPassword: encryptedPassword, // For database
        server: demoAccount.server,
        platform: 'MT5'
      };
    } catch (error) {
      logger.error('Failed to create demo account:', error);
      throw new Error(`Account creation failed: ${error.message}`);
    }
  }

  /**
   * Delete demo account
   * @param {String} mt5Login - MT5 login ID
   */
  async deleteDemoAccount(mt5Login) {
    try {
      // Close connection if active
      if (this.activeConnections.has(mt5Login)) {
        const connection = this.activeConnections.get(mt5Login);
        await connection.close();
        this.activeConnections.delete(mt5Login);
      }

      // Delete account via API
      const accounts = await this.api.metatraderAccountApi.getAccounts();
      const account = accounts.find(acc => acc.login === mt5Login);
      
      if (account) {
        await account.remove();
        logger.info(`Deleted demo account: ${mt5Login}`);
      }
    } catch (error) {
      logger.error(`Failed to delete account ${mt5Login}:`, error);
      throw error;
    }
  }

  /**
   * Connect to trading account and start syncing
   * @param {String} challengeId - Challenge ID
   * @returns {Object} Connection object
   */
  async connectToAccount(challengeId) {
    try {
      const challenge = await Challenge.findById(challengeId);
      if (!challenge) throw new Error('Challenge not found');

      // Check if already connected
      if (this.activeConnections.has(challenge.mt4Login)) {
        return this.activeConnections.get(challenge.mt4Login);
      }

      // Get MetaAPI account
      const accounts = await this.api.metatraderAccountApi.getAccounts();
      let account = accounts.find(acc => acc.login === challenge.mt4Login);

      if (!account) {
        // Create MetaAPI account reference
        account = await this.api.metatraderAccountApi.createAccount({
          login: challenge.mt4Login,
          password: encryptionService.decrypt(challenge.mt4Password),
          server: challenge.mt4Server,
          platform: 'mt5',
          name: `Challenge-${challengeId}`,
          type: 'cloud'
        });
      }

      // Deploy and connect
      await account.deploy();
      await account.waitDeployed();

      const connection = account.getRPCConnection();
      await connection.connect();
      await connection.waitSynchronized();

      this.activeConnections.set(challenge.mt4Login, connection);
      logger.info(`Connected to account ${challenge.mt4Login}`);

      return connection;
    } catch (error) {
      logger.error(`Failed to connect to account:`, error);
      throw error;
    }
  }

  /**
   * Get current account information
   * @param {String} challengeId - Challenge ID
   * @returns {Object} Account info with balance, equity, etc.
   */
  async getAccountInfo(challengeId) {
    try {
      const connection = await this.connectToAccount(challengeId);
      const accountInfo = await connection.getAccountInformation();
      const positions = await connection.getPositions();

      // Calculate floating P/L
      let floatingPL = 0;
      positions.forEach(pos => {
        floatingPL += pos.profit || 0;
      });

      return {
        balance: accountInfo.balance,
        equity: accountInfo.equity,
        margin: accountInfo.margin,
        freeMargin: accountInfo.freeMargin,
        marginLevel: accountInfo.marginLevel,
        floatingPL: floatingPL,
        positions: positions.length,
        credit: accountInfo.credit || 0
      };
    } catch (error) {
      logger.error(`Failed to get account info:`, error);
      throw error;
    }
  }

  /**
   * Sync trades from broker to database
   * @param {String} challengeId - Challenge ID
   * @returns {Array} Synced trades
   */
  async syncTrades(challengeId) {
    try {
      const challenge = await Challenge.findById(challengeId);
      if (!challenge) throw new Error('Challenge not found');

      const connection = await this.connectToAccount(challengeId);
      
      // Get history
      const history = await connection.getHistoryOrdersByTimeRange(
        challenge.startDate,
        new Date()
      );

      const syncedTrades = [];

      for (const order of history) {
        // Skip pending orders
        if (order.state !== 'ORDER_STATE_FILLED') continue;

        // Check if trade already exists
        const existingTrade = await Trade.findOne({
          challengeId: challengeId,
          ticketNumber: order.id
        });

        if (!existingTrade) {
          const trade = new Trade({
            challengeId: challengeId,
            userId: challenge.userId,
            ticketNumber: order.id,
            symbol: order.symbol,
            type: order.type === 'ORDER_TYPE_BUY' ? 'buy' : 'sell',
            volume: order.volume,
            openPrice: order.openPrice,
            closePrice: order.closePrice || order.currentPrice,
            openTime: order.time,
            closeTime: order.closeTime || new Date(),
            profit: order.profit || 0,
            commission: order.commission || 0,
            swap: order.swap || 0,
            comment: order.comment || ''
          });

          await trade.save();
          syncedTrades.push(trade);
        }
      }

      logger.info(`Synced ${syncedTrades.length} trades for challenge ${challengeId}`);
      return syncedTrades;
    } catch (error) {
      logger.error(`Failed to sync trades:`, error);
      throw error;
    }
  }

  /**
   * Get real-time positions
   * @param {String} challengeId - Challenge ID
   * @returns {Array} Open positions
   */
  async getOpenPositions(challengeId) {
    try {
      const connection = await this.connectToAccount(challengeId);
      const positions = await connection.getPositions();
      return positions;
    } catch (error) {
      logger.error(`Failed to get positions:`, error);
      throw error;
    }
  }

  /**
   * Close all connections for maintenance
   */
  async closeAllConnections() {
    try {
      for (const [login, connection] of this.activeConnections.entries()) {
        await connection.close();
        logger.info(`Closed connection for ${login}`);
      }
      this.activeConnections.clear();
    } catch (error) {
      logger.error('Failed to close connections:', error);
    }
  }
}

module.exports = new BrokerService();
```

#### File: `backend/src/services/ruleEngine.js`

```javascript
/**
 * Rule Engine - Trading Rule Validation
 * CRITICAL FILE: Handles all trading rule checks
 */

const Challenge = require('../models/Challenge');
const Trade = require('../models/Trade');
const logger = require('../utils/logger');
const brokerService = require('./brokerService');

class RuleEngine {
  /**
   * Check all rules for a challenge
   * @param {String} challengeId - Challenge ID
   * @returns {Object} Validation result with violations
   */
  async checkAllRules(challengeId) {
    try {
      const challenge = await Challenge.findById(challengeId);
      if (!challenge || challenge.status !== 'active') {
        return { valid: true, violations: [] };
      }

      const violations = [];

      // Get current account info from broker
      const accountInfo = await brokerService.getAccountInfo(challengeId);

      // Update challenge with latest data
      challenge.currentBalance = accountInfo.balance;
      challenge.currentEquity = accountInfo.equity;

      // Check maximum drawdown
      const maxDrawdownCheck = this.checkMaxDrawdown(challenge, accountInfo);
      if (!maxDrawdownCheck.valid) {
        violations.push(maxDrawdownCheck.violation);
      }

      // Check daily drawdown
      const dailyDrawdownCheck = this.checkDailyDrawdown(challenge, accountInfo);
      if (!dailyDrawdownCheck.valid) {
        violations.push(dailyDrawdownCheck.violation);
      }

      // Check profit target (for phases 1 and 2)
      if (challenge.phase < 3) {
        const profitCheck = await this.checkProfitTarget(challenge);
        if (profitCheck.achieved) {
          // Phase completed!
          return { valid: true, violations: [], phaseCompleted: true };
        }
      }

      // Check minimum trading days
      const tradingDaysCheck = await this.checkMinimumTradingDays(challenge);
      
      // Check consistency rule (for equity-based)
      if (challenge.accountType === 'equity-based' && challenge.phase < 3) {
        const consistencyCheck = await this.checkConsistencyRule(challenge);
        if (!consistencyCheck.valid) {
          violations.push(consistencyCheck.violation);
        }
      }

      // Save updated challenge
      if (violations.length > 0) {
        challenge.rulesViolated = violations.map(v => v.rule);
        challenge.status = 'failed';
        challenge.violationDate = new Date();
        challenge.deletionScheduledDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000); // 3 days
      }

      await challenge.save();

      return {
        valid: violations.length === 0,
        violations: violations,
        phaseCompleted: false
      };
    } catch (error) {
      logger.error(`Rule check failed for challenge ${challengeId}:`, error);
      throw error;
    }
  }

  /**
   * Check maximum overall drawdown
   * @param {Object} challenge - Challenge document
   * @param {Object} accountInfo - Current account info from broker
   * @returns {Object} Validation result
   */
  checkMaxDrawdown(challenge, accountInfo) {
    const currentEquity = accountInfo.equity;

    if (challenge.accountType === 'balance-based') {
      // Static drawdown from initial balance
      const maxAllowedDrawdown = challenge.initialBalance * 0.90; // 10% drawdown
      
      if (challenge.currentBalance < maxAllowedDrawdown) {
        return {
          valid: false,
          violation: {
            rule: 'max_drawdown',
            message: `Maximum drawdown exceeded. Balance: $${challenge.currentBalance.toFixed(2)}, Limit: $${maxAllowedDrawdown.toFixed(2)}`,
            type: 'balance-based',
            timestamp: new Date()
          }
        };
      }
    } else {
      // Equity-based: Trailing from highest equity
      const highWaterMark = Math.max(challenge.highestEquity, challenge.initialBalance);
      const maxAllowedDrawdown = highWaterMark * 0.90; // 10% from highest equity

      // Update highest equity if current is higher
      if (currentEquity > challenge.highestEquity) {
        challenge.highestEquity = currentEquity;
      }

      if (currentEquity < maxAllowedDrawdown) {
        return {
          valid: false,
          violation: {
            rule: 'max_drawdown',
            message: `Maximum drawdown exceeded. Equity: $${currentEquity.toFixed(2)}, Limit: $${maxAllowedDrawdown.toFixed(2)} (from high: $${highWaterMark.toFixed(2)})`,
            type: 'equity-based',
            timestamp: new Date()
          }
        };
      }
    }

    return { valid: true };
  }

  /**
   * Check daily drawdown limit
   * @param {Object} challenge - Challenge document
   * @param {Object} accountInfo - Current account info
   * @returns {Object} Validation result
   */
  checkDailyDrawdown(challenge, accountInfo) {
    const currentEquity = accountInfo.equity;
    const currentBalance = accountInfo.balance;

    if (challenge.accountType === 'balance-based') {
      // 5% daily loss from initial balance
      const dailyLimit = challenge.initialBalance * 0.95;
      
      if (currentBalance < dailyLimit) {
        return {
          valid: false,
          violation: {
            rule: 'daily_drawdown',
            message: `Daily loss limit exceeded. Balance: $${currentBalance.toFixed(2)}, Daily Limit: $${dailyLimit.toFixed(2)}`,
            type: 'balance-based',
            timestamp: new Date()
          }
        };
      }
    } else {
      // Equity-based: 5% from daily starting equity
      const dailyStartEquity = challenge.dailyStartEquity || challenge.initialBalance;
      const dailyLimit = dailyStartEquity * 0.95;

      if (currentEquity < dailyLimit) {
        return {
          valid: false,
          violation: {
            rule: 'daily_drawdown',
            message: `Daily loss limit exceeded. Equity: $${currentEquity.toFixed(2)}, Daily Limit: $${dailyLimit.toFixed(2)} (from start: $${dailyStartEquity.toFixed(2)})`,
            type: 'equity-based',
            timestamp: new Date()
          }
        };
      }
    }

    return { valid: true };
  }

  /**
   * Check if profit target is achieved
   * @param {Object} challenge - Challenge document
   * @returns {Object} Result with achieved status
   */
  async checkProfitTarget(challenge) {
    const currentProfit = challenge.currentBalance - challenge.initialBalance;
    const profitTarget = challenge.profitTarget;

    if (currentProfit >= profitTarget) {
      // Check minimum trading days
      const tradingDaysCheck = await this.checkMinimumTradingDays(challenge);
      
      if (tradingDaysCheck.sufficient) {
        return { achieved: true, currentProfit, profitTarget };
      }
    }

    return { achieved: false, currentProfit, profitTarget };
  }

  /**
   * Check minimum trading days requirement
   * @param {Object} challenge - Challenge document
   * @returns {Object} Result with sufficient status
   */
  async checkMinimumTradingDays(challenge) {
    // Get unique trading days
    const trades = await Trade.find({
      challengeId: challenge._id,
      closeTime: { $exists: true }
    });

    const uniqueDays = new Set();
    trades.forEach(trade => {
      const dateStr = trade.closeTime.toISOString().split('T')[0];
      uniqueDays.add(dateStr);
    });

    const tradingDays = uniqueDays.size;
    const requiredDays = 5;

    challenge.tradingDays = tradingDays;

    return {
      sufficient: tradingDays >= requiredDays,
      current: tradingDays,
      required: requiredDays
    };
  }

  /**
   * Check consistency rule (40% rule for equity-based)
   * @param {Object} challenge - Challenge document
   * @returns {Object} Validation result
   */
  async checkConsistencyRule(challenge) {
    const trades = await Trade.find({
      challengeId: challenge._id,
      closeTime: { $exists: true }
    });

    if (trades.length === 0) return { valid: true };

    // Group trades by day
    const dailyProfits = {};
    trades.forEach(trade => {
      const dateStr = trade.closeTime.toISOString().split('T')[0];
      if (!dailyProfits[dateStr]) {
        dailyProfits[dateStr] = 0;
      }
      dailyProfits[dateStr] += trade.profit;
    });

    // Find highest single day profit
    const dailyProfitValues = Object.values(dailyProfits);
    const maxDailyProfit = Math.max(...dailyProfitValues);
    const totalProfit = challenge.currentBalance - challenge.initialBalance;

    // Check if single day exceeds 40% of total
    if (totalProfit > 0 && maxDailyProfit > (totalProfit * 0.40)) {
      return {
        valid: false,
        violation: {
          rule: 'consistency',
          message: `Consistency rule violated. Single day profit ($${maxDailyProfit.toFixed(2)}) exceeds 40% of total profit ($${totalProfit.toFixed(2)})`,
          type: 'equity-based',
          timestamp: new Date()
        }
      };
    }

    return { valid: true };
  }

  /**
   * Reset daily drawdown limits (called at midnight UTC)
   * @param {String} challengeId - Challenge ID (optional, if not provided, resets all)
   */
  async resetDailyDrawdownLimits(challengeId = null) {
    try {
      let challenges;
      
      if (challengeId) {
        challenges = [await Challenge.findById(challengeId)];
      } else {
        challenges = await Challenge.find({ status: 'active' });
      }

      for (const challenge of challenges) {
        if (!challenge) continue;

        if (challenge.accountType === 'equity-based') {
          // Update daily start equity to current equity
          const accountInfo = await brokerService.getAccountInfo(challenge._id);
          challenge.dailyStartEquity = accountInfo.equity;
          await challenge.save();
          logger.info(`Reset daily limit for challenge ${challenge._id}: $${accountInfo.equity}`);
        }
        // Balance-based doesn't need daily reset as it's static
      }

      logger.info(`Daily drawdown limits reset for ${challenges.length} challenges`);
    } catch (error) {
      logger.error('Failed to reset daily drawdown limits:', error);
    }
  }
}

module.exports = new RuleEngine();
```

#### File: `backend/src/jobs/syncTrades.job.js`

```javascript
/**
 * Sync Trades Job - Real-time trade synchronization
 * Runs every 5 minutes to fetch new trades from broker
 */

const cron = require('node-cron');
const Challenge = require('../models/Challenge');
const brokerService = require('../services/brokerService');
const logger = require('../utils/logger');
const socketService = require('../websocket/tradeEvents');

class SyncTradesJob {
  start() {
    // Run every 5 minutes
    cron.schedule('*/5 * * * *', async () => {
      await this.execute();
    });
    
    logger.info('Sync trades job started (every 5 minutes)');
  }

  async execute() {
    try {
      const activeChallenges = await Challenge.find({ 
        status: 'active' 
      });

      logger.info(`Syncing trades for ${activeChallenges.length} active challenges`);

      for (const challenge of activeChallenges) {
        try {
          const newTrades = await brokerService.syncTrades(challenge._id);
          
          if (newTrades.length > 0) {
            // Emit real-time update to connected clients
            socketService.emitTradeUpdate(challenge.userId.toString(), {
              challengeId: challenge._id,
              newTrades: newTrades
            });
            
            logger.info(`Synced ${newTrades.length} trades for challenge ${challenge._id}`);
          }
        } catch (error) {
          logger.error(`Failed to sync challenge ${challenge._id}:`, error);
        }
      }
    } catch (error) {
      logger.error('Sync trades job failed:', error);
    }
  }
}

module.exports = new SyncTradesJob();
```

#### File: `backend/src/jobs/checkRules.job.js`

```javascript
/**
 * Check Rules Job - Continuous rule monitoring
 * Runs every 10 minutes to check all active challenges
 */

const cron = require('node-cron');
const Challenge = require('../models/Challenge');
const ruleEngine = require('../services/ruleEngine');
const notificationService = require('../services/notificationService');
const logger = require('../utils/logger');

class CheckRulesJob {
  start() {
    // Run every 10 minutes
    cron.schedule('*/10 * * * *', async () => {
      await this.execute();
    });
    
    logger.info('Check rules job started (every 10 minutes)');
  }

  async execute() {
    try {
      const activeChallenges = await Challenge.find({ 
        status: 'active' 
      }).populate('userId');

      logger.info(`Checking rules for ${activeChallenges.length} challenges`);

      for (const challenge of activeChallenges) {
        try {
          const result = await ruleEngine.checkAllRules(challenge._id);
          
          if (!result.valid && result.violations.length > 0) {
            // Rule violated - send notification
            await notificationService.sendRuleViolationEmail(
              challenge.userId,
              challenge,
              result.violations
            );
            
            logger.warn(`Challenge ${challenge._id} violated rules:`, result.violations);
          } else if (result.phaseCompleted) {
            // Phase completed - send congratulations
            await notificationService.sendPhaseCompletionEmail(
              challenge.userId,
              challenge
            );
            
            logger.info(`Challenge ${challenge._id} completed phase ${challenge.phase}`);
          }
        } catch (error) {
          logger.error(`Rule check failed for challenge ${challenge._id}:`, error);
        }
      }
    } catch (error) {
      logger.error('Check rules job failed:', error);
    }
  }
}

module.exports = new CheckRulesJob();
```

### Alternative: Direct Doprime API
- Contact Doprime support for API documentation
- Request demo account creation API access
- Implement custom integration
- Higher control but more complex

---

## 8. SECURITY REQUIREMENTS

### Critical Security Measures

1. **Credential Storage**:
   ```javascript
   // Encrypt MT4/MT5 passwords before storing
   const crypto = require('crypto');
   
   const algorithm = 'aes-256-cbc';
   const key = process.env.ENCRYPTION_KEY; // 32 bytes
   const iv = crypto.randomBytes(16);
   
   function encrypt(text) {
     const cipher = crypto.createCipheriv(algorithm, key, iv);
     let encrypted = cipher.update(text, 'utf8', 'hex');
     encrypted += cipher.final('hex');
     return iv.toString('hex') + ':' + encrypted;
   }
   
   function decrypt(text) {
     const parts = text.split(':');
     const iv = Buffer.from(parts.shift(), 'hex');
     const encrypted = parts.join(':');
     const decipher = crypto.createDecipheriv(algorithm, key, iv);
     let decrypted = decipher.update(encrypted, 'hex', 'utf8');
     decrypted += decipher.final('utf8');
     return decrypted;
   }
   ```

2. **API Rate Limiting**:
   - Prevent brute force attacks
   - Limit login attempts
   - Throttle API requests

3. **Input Validation**:
   - Sanitize all user inputs
   - Use schema validation (Joi/Zod)
   - Prevent NoSQL injection

4. **Session Management**:
   - Use HTTP-only secure cookies
   - Implement CSRF tokens
   - Short-lived access tokens
   - Refresh token rotation

5. **Data Privacy**:
   - GDPR compliance
   - User data export functionality
   - Right to deletion
   - Audit logs for admin actions

6. **Secure Communication**:
   - SSL/TLS certificates
   - Encrypt sensitive data in transit
   - Secure WebSocket connections (WSS)

7. **Backup & Recovery**:
   - Daily automated backups
   - Disaster recovery plan
   - Data redundancy

---

## 9. FRONTEND FEATURES

### Key Pages

1. **Landing Page**
   - Hero section with value proposition
   - Account size comparison table
   - How it works (3-step process)
   - Testimonials
   - FAQ section
   - CTA buttons

2. **User Dashboard**
   - Active challenges overview
   - Performance metrics
   - Quick stats cards
   - Recent trades table
   - Notifications center

3. **Challenge Details Page**
   - Equity chart
   - Rule status indicators (visual)
   - Trade history
   - Statistics breakdown
   - Download reports

4. **Purchase Flow**
   - Account size selector
   - Account type comparison (balance vs equity)
   - Payment form
   - Order confirmation

5. **Admin Dashboard**
   - System statistics
   - User management table
   - Challenge monitoring
   - Financial reports
   - Settings panel

### UI Components Library
- Use shadcn/ui for consistency
- Custom trading-specific components:
  - Equity curve chart
  - Profit/loss indicators
  - Rule status progress bars
  - Trading statistics cards
  - Account comparison cards

---

### Critical Frontend Component Examples

#### File: `frontend/src/components/challenge/EquityChart.jsx`

```jsx
/**
 * Equity Chart Component
 * Real-time equity curve visualization with drawdown indicators
 */

import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine, Area, ComposedChart } from 'recharts';
import { useWebSocket } from '../../hooks/useWebSocket';

const EquityChart = ({ challengeId, accountType, initialBalance, maxDrawdown }) => {
  const [equityData, setEquityData] = useState([]);
  const { socket } = useWebSocket();

  useEffect(() => {
    // Fetch historical equity data
    fetchEquityHistory();

    // Subscribe to real-time updates
    if (socket) {
      socket.on(`equity-update-${challengeId}`, handleEquityUpdate);
    }

    return () => {
      if (socket) {
        socket.off(`equity-update-${challengeId}`);
      }
    };
  }, [challengeId, socket]);

  const fetchEquityHistory = async () => {
    try {
      const response = await fetch(`/api/challenges/${challengeId}/equity-history`);
      const data = await response.json();
      setEquityData(data.history);
    } catch (error) {
      console.error('Failed to fetch equity history:', error);
    }
  };

  const handleEquityUpdate = (update) => {
    setEquityData(prev => [...prev, {
      timestamp: new Date(update.timestamp),
      equity: update.equity,
      balance: update.balance,
      drawdown: update.drawdown
    }]);
  };

  // Calculate drawdown limit line
  const drawdownLimit = accountType === 'balance-based' 
    ? initialBalance * 0.90 
    : maxDrawdown;

  // Format data for chart
  const chartData = equityData.map(item => ({
    time: new Date(item.timestamp).toLocaleTimeString(),
    equity: item.equity,
    balance: item.balance,
    drawdownLimit: drawdownLimit
  }));

  return (
    <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
      <h3 className="text-xl font-semibold text-white mb-4">Equity Curve</h3>
      
      <ResponsiveContainer width="100%" height={400}>
        <ComposedChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis 
            dataKey="time" 
            stroke="#9CA3AF" 
            tick={{ fill: '#9CA3AF' }}
          />
          <YAxis 
            stroke="#9CA3AF" 
            tick={{ fill: '#9CA3AF' }}
            domain={['dataMin - 500', 'dataMax + 500']}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#1F2937', 
              border: '1px solid #374151',
              borderRadius: '8px'
            }}
            labelStyle={{ color: '#F3F4F6' }}
          />
          <Legend />
          
          {/* Drawdown limit line */}
          <ReferenceLine 
            y={drawdownLimit} 
            stroke="#EF4444" 
            strokeDasharray="5 5"
            label={{ value: 'Max Drawdown', fill: '#EF4444', position: 'right' }}
          />
          
          {/* Initial balance line */}
          <ReferenceLine 
            y={initialBalance} 
            stroke="#6B7280" 
            strokeDasharray="3 3"
            label={{ value: 'Initial Balance', fill: '#6B7280', position: 'left' }}
          />
          
          {/* Equity line */}
          <Line 
            type="monotone" 
            dataKey="equity" 
            stroke="#00D9FF" 
            strokeWidth={3}
            dot={false}
            name="Equity"
          />
          
          {/* Balance line */}
          <Line 
            type="monotone" 
            dataKey="balance" 
            stroke="#00FF88" 
            strokeWidth={2}
            dot={false}
            name="Balance"
          />
        </ComposedChart>
      </ResponsiveContainer>

      <div className="mt-4 grid grid-cols-3 gap-4">
        <div className="text-center">
          <p className="text-gray-400 text-sm">Current Equity</p>
          <p className="text-2xl font-bold text-cyan-400">
            ${equityData[equityData.length - 1]?.equity.toFixed(2) || '0.00'}
          </p>
        </div>
        <div className="text-center">
          <p className="text-gray-400 text-sm">Current Balance</p>
          <p className="text-2xl font-bold text-green-400">
            ${equityData[equityData.length - 1]?.balance.toFixed(2) || '0.00'}
          </p>
        </div>
        <div className="text-center">
          <p className="text-gray-400 text-sm">Distance to Limit</p>
          <p className="text-2xl font-bold text-red-400">
            ${((equityData[equityData.length - 1]?.equity || 0) - drawdownLimit).toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default EquityChart;
```

#### File: `frontend/src/components/challenge/RuleStatusIndicator.jsx`

```jsx
/**
 * Rule Status Indicator Component
 * Visual display of all trading rules and their current status
 */

import React from 'react';
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

const RuleStatusIndicator = ({ challenge, currentEquity, currentBalance }) => {
  const calculateRuleStatus = () => {
    const rules = [];

    // Profit Target
    const currentProfit = currentBalance - challenge.initialBalance;
    const profitProgress = (currentProfit / challenge.profitTarget) * 100;
    
    rules.push({
      name: 'Profit Target',
      status: currentProfit >= challenge.profitTarget ? 'achieved' : 'in-progress',
      current: `$${currentProfit.toFixed(2)}`,
      target: `$${challenge.profitTarget.toFixed(2)}`,
      progress: Math.min(profitProgress, 100),
      description: challenge.phase === 3 ? 'No target (funded account)' : `Reach ${(challenge.profitTarget / challenge.initialBalance * 100).toFixed(0)}% profit`
    });

    // Maximum Drawdown
    let maxDrawdownLimit, maxDrawdownCurrent, maxDrawdownProgress;
    
    if (challenge.accountType === 'balance-based') {
      maxDrawdownLimit = challenge.initialBalance * 0.90;
      maxDrawdownCurrent = currentBalance;
      const distanceFromLimit = currentBalance - maxDrawdownLimit;
      maxDrawdownProgress = (distanceFromLimit / (challenge.initialBalance * 0.10)) * 100;
    } else {
      const highWaterMark = Math.max(challenge.highestEquity, challenge.initialBalance);
      maxDrawdownLimit = highWaterMark * 0.90;
      maxDrawdownCurrent = currentEquity;
      const distanceFromLimit = currentEquity - maxDrawdownLimit;
      maxDrawdownProgress = (distanceFromLimit / (highWaterMark * 0.10)) * 100;
    }

    rules.push({
      name: 'Maximum Drawdown',
      status: maxDrawdownCurrent >= maxDrawdownLimit ? 'safe' : 'violated',
      current: `$${maxDrawdownCurrent.toFixed(2)}`,
      target: `> $${maxDrawdownLimit.toFixed(2)}`,
      progress: Math.max(0, Math.min(maxDrawdownProgress, 100)),
      description: `Must stay above $${maxDrawdownLimit.toFixed(2)}`,
      type: challenge.accountType
    });

    // Daily Drawdown
    let dailyLimit, dailyCurrent, dailyProgress;
    
    if (challenge.accountType === 'balance-based') {
      dailyLimit = challenge.initialBalance * 0.95;
      dailyCurrent = currentBalance;
      const distanceFromLimit = currentBalance - dailyLimit;
      dailyProgress = (distanceFromLimit / (challenge.initialBalance * 0.05)) * 100;
    } else {
      dailyLimit = (challenge.dailyStartEquity || challenge.initialBalance) * 0.95;
      dailyCurrent = currentEquity;
      const distanceFromLimit = currentEquity - dailyLimit;
      dailyProgress = (distanceFromLimit / ((challenge.dailyStartEquity || challenge.initialBalance) * 0.05)) * 100;
    }

    rules.push({
      name: 'Daily Loss Limit',
      status: dailyCurrent >= dailyLimit ? 'safe' : 'violated',
      current: `$${dailyCurrent.toFixed(2)}`,
      target: `> $${dailyLimit.toFixed(2)}`,
      progress: Math.max(0, Math.min(dailyProgress, 100)),
      description: 'Resets daily at midnight UTC'
    });

    // Trading Days
    rules.push({
      name: 'Minimum Trading Days',
      status: challenge.tradingDays >= 5 ? 'achieved' : 'in-progress',
      current: `${challenge.tradingDays} days`,
      target: '5 days',
      progress: (challenge.tradingDays / 5) * 100,
      description: 'Must trade on at least 5 different days'
    });

    return rules;
  };

  const rules = calculateRuleStatus();

  const getStatusIcon = (status) => {
    switch (status) {
      case 'achieved':
      case 'safe':
        return <CheckCircle className="text-green-500" size={24} />;
      case 'violated':
        return <XCircle className="text-red-500" size={24} />;
      case 'in-progress':
      default:
        return <AlertTriangle className="text-yellow-500" size={24} />;
    }
  };

  const getProgressColor = (status, progress) => {
    if (status === 'violated') return 'bg-red-500';
    if (status === 'achieved' || status === 'safe') return 'bg-green-500';
    if (progress > 80) return 'bg-yellow-500';
    return 'bg-cyan-500';
  };

  return (
    <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
      <h3 className="text-xl font-semibold text-white mb-6">Trading Rules Status</h3>
      
      <div className="space-y-6">
        {rules.map((rule, index) => (
          <div key={index} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {getStatusIcon(rule.status)}
                <div>
                  <h4 className="text-white font-medium">{rule.name}</h4>
                  <p className="text-gray-400 text-sm">{rule.description}</p>
                  {rule.type && (
                    <span className="text-xs text-cyan-400">({rule.type})</span>
                  )}
                </div>
              </div>
              <div className="text-right">
                <p className="text-white font-semibold">{rule.current}</p>
                <p className="text-gray-400 text-sm">Target: {rule.target}</p>
              </div>
            </div>
            
            {/* Progress bar */}
            <div className="w-full bg-gray-800 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(rule.status, rule.progress)}`}
                style={{ width: `${rule.progress}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="mt-6 pt-6 border-t border-gray-800">
        <div className="flex items-center justify-between">
          <p className="text-gray-400">Overall Status</p>
          <p className={`font-bold ${
            rules.every(r => r.status === 'safe' || r.status === 'achieved') 
              ? 'text-green-500' 
              : rules.some(r => r.status === 'violated')
              ? 'text-red-500'
              : 'text-yellow-500'
          }`}>
            {rules.every(r => r.status === 'safe' || r.status === 'achieved') 
              ? '✓ All Rules Passing' 
              : rules.some(r => r.status === 'violated')
              ? '✗ Rules Violated'
              : '⚠ In Progress'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default RuleStatusIndicator;
```

#### File: `frontend/src/hooks/useWebSocket.js`

```javascript
/**
 * WebSocket Hook
 * Manages real-time connection for live updates
 */

import { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import { useAuth } from './useAuth';

export const useWebSocket = () => {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const { user } = useAuth();
  const socketRef = useRef(null);

  useEffect(() => {
    if (!user) return;

    // Connect to WebSocket server
    const newSocket = io(process.env.REACT_APP_WS_URL || 'http://localhost:5000', {
      auth: {
        token: localStorage.getItem('token')
      },
      transports: ['websocket']
    });

    newSocket.on('connect', () => {
      console.log('WebSocket connected');
      setConnected(true);
      
      // Join user's personal room
      newSocket.emit('join-user-room', user._id);
    });

    newSocket.on('disconnect', () => {
      console.log('WebSocket disconnected');
      setConnected(false);
    });

    newSocket.on('error', (error) => {
      console.error('WebSocket error:', error);
    });

    socketRef.current = newSocket;
    setSocket(newSocket);

    return () => {
      if (newSocket) {
        newSocket.disconnect();
      }
    };
  }, [user]);

  const emit = (event, data) => {
    if (socketRef.current && connected) {
      socketRef.current.emit(event, data);
    }
  };

  const on = (event, handler) => {
    if (socketRef.current) {
      socketRef.current.on(event, handler);
    }
  };

  const off = (event, handler) => {
    if (socketRef.current) {
      socketRef.current.off(event, handler);
    }
  };

  return {
    socket: socketRef.current,
    connected,
    emit,
    on,
    off
  };
};
```

#### File: `frontend/src/services/challengeService.js`

```javascript
/**
 * Challenge Service
 * API calls for challenge management
 */

import api from './api';

class ChallengeService {
  async purchaseChallenge(data) {
    const response = await api.post('/challenges/purchase', data);
    return response.data;
  }

  async getChallenges(userId) {
    const response = await api.get(`/challenges/user/${userId}`);
    return response.data;
  }

  async getChallengeDetails(challengeId) {
    const response = await api.get(`/challenges/${challengeId}`);
    return response.data;
  }

  async getEquityHistory(challengeId) {
    const response = await api.get(`/challenges/${challengeId}/equity-history`);
    return response.data;
  }

  async getTradeHistory(challengeId) {
    const response = await api.get(`/challenges/${challengeId}/trades`);
    return response.data;
  }

  async getStatistics(challengeId) {
    const response = await api.get(`/challenges/${challengeId}/statistics`);
    return response.data;
  }

  async requestPayout(challengeId, amount) {
    const response = await api.post(`/challenges/${challengeId}/payout`, { amount });
    return response.data;
  }

  async downloadCertificate(challengeId) {
    const response = await api.get(`/challenges/${challengeId}/certificate`, {
      responseType: 'blob'
    });
    return response.data;
  }

  async retryChallenge(failedChallengeId) {
    const response = await api.post(`/challenges/${failedChallengeId}/retry`);
    return response.data;
  }
}

export default new ChallengeService();
```

---

---

## 10. AUTOMATED PROCESSES

### Scheduled Jobs (Cron Jobs)

```javascript
// Daily reset of daily drawdown limits (at midnight UTC)
cron.schedule('0 0 * * *', async () => {
  await resetDailyDrawdownLimits();
});

// Check for accounts scheduled for deletion
cron.schedule('0 */6 * * *', async () => {
  await deleteExpiredAccounts();
});

// Sync trading data every 5 minutes
cron.schedule('*/5 * * * *', async () => {
  await syncTradingData();
});

// Generate daily reports
cron.schedule('0 1 * * *', async () => {
  await generateDailyReports();
});

// Check for phase progression
cron.schedule('*/10 * * * *', async () => {
  await checkPhaseCompletion();
});
```

### Real-Time Processes
- WebSocket listeners for trade execution
- Immediate rule violation checks
- Live equity updates
- Instant notifications

---

## 10.5 ENVIRONMENT VARIABLES & CONFIGURATION

### File: `backend/.env.example`

```bash
# ====================================
# TRIVARO PROP FIRM - ENVIRONMENT VARIABLES
# Copy this file to .env and fill in your values
# ====================================

# -------------------- APPLICATION --------------------
NODE_ENV=development
PORT=5000
APP_NAME=Trivaro Prop Firm
FRONTEND_URL=http://localhost:3000

# -------------------- DATABASE --------------------
# MongoDB (Option 1 - Recommended)
MONGODB_URI=mongodb://localhost:27017/trivaro
# MongoDB Atlas (Production)
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/trivaro?retryWrites=true&w=majority

# PostgreSQL (Option 2)
# POSTGRES_HOST=localhost
# POSTGRES_PORT=5432
# POSTGRES_DB=trivaro
# POSTGRES_USER=postgres
# POSTGRES_PASSWORD=yourpassword

# -------------------- REDIS --------------------
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
# Redis Cloud
# REDIS_URL=redis://username:password@host:port

# -------------------- JWT & SECURITY --------------------
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=your-refresh-token-secret
JWT_REFRESH_EXPIRE=30d

# Encryption key for sensitive data (32 bytes in hex)
ENCRYPTION_KEY=0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef
ENCRYPTION_IV_LENGTH=16

# -------------------- DOPRIME / METAAPI --------------------
# MetaAPI (Recommended)
META_API_TOKEN=your-metaapi-token-here
DOPRIME_SERVER_NAME=Doprime-Server

# Direct MT5 Manager API (Alternative)
# MT5_MANAGER_HOST=your-doprime-server.com
# MT5_MANAGER_PORT=443
# MT5_MANAGER_LOGIN=your-manager-login
# MT5_MANAGER_PASSWORD=your-manager-password

# -------------------- EMAIL SERVICE --------------------
# SendGrid (Recommended)
EMAIL_SERVICE=sendgrid
SENDGRID_API_KEY=your-sendgrid-api-key
EMAIL_FROM=noreply@trivaro.com
EMAIL_FROM_NAME=Trivaro Prop Firm

# Nodemailer (Alternative)
# EMAIL_SERVICE=smtp
# SMTP_HOST=smtp.gmail.com
# SMTP_PORT=587
# SMTP_SECURE=false
# SMTP_USER=your-email@gmail.com
# SMTP_PASSWORD=your-app-password

# -------------------- PAYMENT GATEWAYS --------------------
# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLIC_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# PayPal
PAYPAL_CLIENT_ID=your-paypal-client-id
PAYPAL_CLIENT_SECRET=your-paypal-client-secret
PAYPAL_MODE=sandbox # or 'live' for production

# Cryptocurrency (Optional)
# COINBASE_API_KEY=your-coinbase-api-key
# COINBASE_API_SECRET=your-coinbase-secret

# -------------------- FILE STORAGE --------------------
# AWS S3
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_REGION=us-east-1
AWS_S3_BUCKET=trivaro-documents

# Cloudinary (Alternative)
# CLOUDINARY_CLOUD_NAME=your-cloud-name
# CLOUDINARY_API_KEY=your-api-key
# CLOUDINARY_API_SECRET=your-api-secret

# -------------------- LOGGING --------------------
LOG_LEVEL=info # debug, info, warn, error
LOG_FILE_PATH=./logs/app.log

# -------------------- RATE LIMITING --------------------
RATE_LIMIT_WINDOW=15 # minutes
RATE_LIMIT_MAX_REQUESTS=100

# -------------------- CORS --------------------
ALLOWED_ORIGINS=http://localhost:3000,https://trivaro.com

# -------------------- SESSION --------------------
SESSION_SECRET=your-session-secret-key
SESSION_TIMEOUT=86400000 # 24 hours in milliseconds

# -------------------- ADMIN --------------------
ADMIN_EMAIL=admin@trivaro.com
ADMIN_PASSWORD=change-this-secure-password

# -------------------- WEBHOOKS --------------------
WEBHOOK_SECRET=your-webhook-secret-for-verification

# -------------------- CRON JOBS --------------------
ENABLE_CRON_JOBS=true
SYNC_TRADES_INTERVAL=5 # minutes
CHECK_RULES_INTERVAL=10 # minutes

# -------------------- WEBSOCKET --------------------
WS_PORT=5001
WS_CORS_ORIGIN=http://localhost:3000

# -------------------- MONITORING (Optional) --------------------
# Sentry for error tracking
# SENTRY_DSN=your-sentry-dsn

# Google Analytics
# GA_TRACKING_ID=UA-XXXXXXXXX-X

# -------------------- KYC SERVICE (Optional) --------------------
# Jumio, Onfido, or similar
# KYC_API_KEY=your-kyc-api-key
# KYC_API_SECRET=your-kyc-secret
```

### File: `frontend/.env.example`

```bash
# ====================================
# TRIVARO FRONTEND - ENVIRONMENT VARIABLES
# ====================================

# API Configuration
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_WS_URL=http://localhost:5001

# Stripe Public Key
REACT_APP_STRIPE_PUBLIC_KEY=pk_test_...

# PayPal Client ID
REACT_APP_PAYPAL_CLIENT_ID=your-paypal-client-id

# Google Analytics (Optional)
REACT_APP_GA_TRACKING_ID=UA-XXXXXXXXX-X

# App Configuration
REACT_APP_NAME=Trivaro Prop Firm
REACT_APP_SUPPORT_EMAIL=support@trivaro.com

# Feature Flags
REACT_APP_ENABLE_2FA=true
REACT_APP_ENABLE_CRYPTO_PAYMENT=false
```

### File: `backend/src/config/database.js`

```javascript
/**
 * Database Configuration
 * MongoDB connection setup with error handling
 */

const mongoose = require('mongoose');
const logger = require('../utils/logger');

const connectDB = async () => {
  try {
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    };

    await mongoose.connect(process.env.MONGODB_URI, options);
    
    logger.info(`MongoDB Connected: ${mongoose.connection.host}`);

    // Handle connection events
    mongoose.connection.on('error', (err) => {
      logger.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected');
    });

    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      logger.info('MongoDB connection closed due to app termination');
      process.exit(0);
    });

  } catch (error) {
    logger.error('MongoDB connection failed:', error);
    process.exit(1);
  }
};

module.exports = connectDB;
```

### File: `backend/src/config/redis.js`

```javascript
/**
 * Redis Configuration
 * Session storage and caching
 */

const Redis = require('ioredis');
const logger = require('../utils/logger');

const redisClient = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD || undefined,
  retryStrategy: (times) => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
  maxRetriesPerRequest: 3
});

redisClient.on('connect', () => {
  logger.info('Redis connected successfully');
});

redisClient.on('error', (err) => {
  logger.error('Redis connection error:', err);
});

redisClient.on('ready', () => {
  logger.info('Redis is ready to accept commands');
});

module.exports = redisClient;
```

### File: `backend/src/utils/logger.js`

```javascript
/**
 * Logger Configuration
 * Winston logger with file and console transports
 */

const winston = require('winston');
const path = require('path');

const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json()
);

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: logFormat,
  defaultMeta: { service: 'trivaro-backend' },
  transports: [
    // Write all logs to console
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    }),
    
    // Write all logs with level 'error' and below to error.log
    new winston.transports.File({ 
      filename: path.join(__dirname, '../../logs/error.log'), 
      level: 'error' 
    }),
    
    // Write all logs to combined.log
    new winston.transports.File({ 
      filename: path.join(__dirname, '../../logs/combined.log')
    })
  ]
});

// If we're in development, log to the console with more detail
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.printf(
        info => `${info.timestamp} ${info.level}: ${info.message}` + (info.stack ? `\n${info.stack}` : '')
      )
    )
  }));
}

module.exports = logger;
```

---

---

## 11. TESTING REQUIREMENTS

### Testing Strategy

1. **Unit Tests**:
   - All rule checking functions
   - Payment processing
   - Account creation logic
   - Authentication flows

2. **Integration Tests**:
   - Doprime API integration
   - Database operations
   - Email delivery
   - Payment gateway

3. **End-to-End Tests**:
   - User registration to funded account
   - Challenge purchase flow
   - Admin workflows
   - Payout process

4. **Load Testing**:
   - Concurrent user handling
   - Real-time data sync performance
   - Database query optimization

5. **Security Testing**:
   - Penetration testing
   - Vulnerability scanning
   - SQL injection attempts
   - XSS protection

---

## 12. DEPLOYMENT

### Hosting Recommendations

1. **Application Servers**:
   - AWS EC2 / DigitalOcean Droplets / Heroku
   - Minimum 2 instances for load balancing
   - Auto-scaling based on traffic

2. **Database**:
   - MongoDB Atlas (managed) OR
   - Self-hosted PostgreSQL with replication

3. **Redis**:
   - Redis Cloud OR
   - Self-hosted Redis cluster

4. **Storage**:
   - AWS S3 for document storage
   - CloudFront CDN for assets

5. **Domain & SSL**:
   - Custom domain (trivaro.com)
   - Let's Encrypt SSL certificate

### CI/CD Pipeline
- GitHub Actions / GitLab CI
- Automated testing on commits
- Staging environment for testing
- Production deployment with rollback capability

---

### Deployment Configuration Files

#### File: `docker/Dockerfile.backend`

```dockerfile
# Backend Dockerfile
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install dependencies
COPY backend/package*.json ./
RUN npm ci --only=production

# Copy application code
COPY backend/ .

# Create logs directory
RUN mkdir -p logs

# Expose port
EXPOSE 5000 5001

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start application
CMD ["node", "src/server.js"]
```

#### File: `docker/Dockerfile.frontend`

```dockerfile
# Frontend Dockerfile
FROM node:18-alpine as build

WORKDIR /app

# Install dependencies
COPY frontend/package*.json ./
RUN npm ci

# Copy source files
COPY frontend/ .

# Build application
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy build files
COPY --from=build /app/build /usr/share/nginx/html

# Copy nginx configuration
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

#### File: `docker/docker-compose.yml`

```yaml
version: '3.8'

services:
  # MongoDB
  mongodb:
    image: mongo:6.0
    container_name: trivaro-mongodb
    restart: always
    environment:
      MONGO_INITDB_ROOT_USERNAME: ${MONGO_USERNAME}
      MONGO_INITDB_ROOT_PASSWORD: ${MONGO_PASSWORD}
      MONGO_INITDB_DATABASE: trivaro
    ports:
      - "27017:27017"
    volumes:
      - mongodb_data:/data/db
      - ./database/backup:/backup
    networks:
      - trivaro-network

  # Redis
  redis:
    image: redis:7-alpine
    container_name: trivaro-redis
    restart: always
    command: redis-server --requirepass ${REDIS_PASSWORD}
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    networks:
      - trivaro-network

  # Backend API
  backend:
    build:
      context: ../
      dockerfile: docker/Dockerfile.backend
    container_name: trivaro-backend
    restart: always
    env_file:
      - ../backend/.env
    ports:
      - "5000:5000"
      - "5001:5001"
    depends_on:
      - mongodb
      - redis
    volumes:
      - ../backend/logs:/app/logs
      - ../backend/uploads:/app/uploads
    networks:
      - trivaro-network
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:5000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

  # Frontend
  frontend:
    build:
      context: ../
      dockerfile: docker/Dockerfile.frontend
    container_name: trivaro-frontend
    restart: always
    ports:
      - "80:80"
      - "443:443"
    depends_on:
      - backend
    volumes:
      - ../nginx/ssl:/etc/nginx/ssl:ro
    networks:
      - trivaro-network

volumes:
  mongodb_data:
    driver: local
  redis_data:
    driver: local

networks:
  trivaro-network:
    driver: bridge
```

#### File: `nginx/nginx.conf`

```nginx
# Nginx Configuration for Trivaro Prop Firm

upstream backend {
    least_conn;
    server backend:5000 max_fails=3 fail_timeout=30s;
}

upstream websocket {
    ip_hash;
    server backend:5001 max_fails=3 fail_timeout=30s;
}

# Rate limiting
limit_req_zone $binary_remote_addr zone=api_limit:10m rate=10r/s;
limit_req_zone $binary_remote_addr zone=login_limit:10m rate=5r/m;

server {
    listen 80;
    server_name trivaro.com www.trivaro.com;

    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name trivaro.com www.trivaro.com;

    # SSL Configuration
    ssl_certificate /etc/nginx/ssl/trivaro.crt;
    ssl_certificate_key /etc/nginx/ssl/trivaro.key;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # Security Headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;

    # Frontend static files
    root /usr/share/nginx/html;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json;

    # Frontend routes
    location / {
        try_files $uri $uri/ /index.html;
    }

    # API proxy
    location /api {
        limit_req zone=api_limit burst=20 nodelay;
        
        proxy_pass http://backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Login endpoint with stricter rate limit
    location /api/auth/login {
        limit_req zone=login_limit burst=3 nodelay;
        
        proxy_pass http://backend;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # WebSocket proxy
    location /socket.io {
        proxy_pass http://websocket;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        
        proxy_connect_timeout 7d;
        proxy_send_timeout 7d;
        proxy_read_timeout 7d;
    }

    # Health check endpoint
    location /health {
        access_log off;
        proxy_pass http://backend;
    }

    # Deny access to hidden files
    location ~ /\. {
        deny all;
        access_log off;
        log_not_found off;
    }
}
```

#### File: `.github/workflows/deploy.yml`

```yaml
name: Deploy Trivaro Prop Firm

on:
  push:
    branches:
      - main
      - production
  pull_request:
    branches:
      - main

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      mongodb:
        image: mongo:6.0
        ports:
          - 27017:27017
      redis:
        image: redis:7-alpine
        ports:
          - 6379:6379
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install backend dependencies
        run: |
          cd backend
          npm ci
      
      - name: Run backend tests
        run: |
          cd backend
          npm test
        env:
          NODE_ENV: test
          MONGODB_URI: mongodb://localhost:27017/trivaro_test
          REDIS_HOST: localhost
      
      - name: Install frontend dependencies
        run: |
          cd frontend
          npm ci
      
      - name: Run frontend tests
        run: |
          cd frontend
          npm test
      
      - name: Build frontend
        run: |
          cd frontend
          npm run build

  deploy-staging:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to staging
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.STAGING_HOST }}
          username: ${{ secrets.STAGING_USER }}
          key: ${{ secrets.STAGING_SSH_KEY }}
          script: |
            cd /var/www/trivaro-staging
            git pull origin main
            docker-compose down
            docker-compose up -d --build
            docker-compose logs -f

  deploy-production:
    needs: test
    if: github.ref == 'refs/heads/production'
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to production
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.PROD_HOST }}
          username: ${{ secrets.PROD_USER }}
          key: ${{ secrets.PROD_SSH_KEY }}
          script: |
            cd /var/www/trivaro
            git pull origin production
            docker-compose down
            docker-compose up -d --build
            
      - name: Verify deployment
        run: |
          sleep 30
          curl --fail https://trivaro.com/health || exit 1
      
      - name: Notify team
        if: success()
        uses: 8398a7/action-slack@v3
        with:
          status: ${{ job.status }}
          text: 'Production deployment successful! 🚀'
          webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

#### File: `scripts/deploy.sh`

```bash
#!/bin/bash
# Deployment script for Trivaro Prop Firm

set -e

echo "🚀 Starting deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if environment is provided
if [ -z "$1" ]; then
    echo -e "${RED}Error: Environment not specified${NC}"
    echo "Usage: ./deploy.sh [staging|production]"
    exit 1
fi

ENV=$1

echo -e "${YELLOW}Deploying to $ENV environment...${NC}"

# Pull latest code
echo "📥 Pulling latest code..."
git pull origin main

# Install dependencies
echo "📦 Installing dependencies..."
cd backend && npm ci && cd ..
cd frontend && npm ci && cd ..

# Run tests
echo "🧪 Running tests..."
cd backend && npm test && cd ..
cd frontend && npm test && cd ..

# Build frontend
echo "🏗️  Building frontend..."
cd frontend && npm run build && cd ..

# Backup database
echo "💾 Creating database backup..."
./scripts/backup.sh

# Deploy using docker-compose
echo "🐳 Deploying with Docker..."
docker-compose -f docker/docker-compose.yml down
docker-compose -f docker/docker-compose.yml up -d --build

# Wait for services to be healthy
echo "⏳ Waiting for services to be healthy..."
sleep 30

# Health check
echo "🏥 Running health checks..."
HEALTH_CHECK=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:5000/health)

if [ "$HEALTH_CHECK" -eq 200 ]; then
    echo -e "${GREEN}✅ Deployment successful!${NC}"
    echo -e "${GREEN}Application is running and healthy${NC}"
else
    echo -e "${RED}❌ Deployment failed! Health check returned: $HEALTH_CHECK${NC}"
    echo "Rolling back..."
    docker-compose -f docker/docker-compose.yml down
    exit 1
fi

# Clean up old Docker images
echo "🧹 Cleaning up old Docker images..."
docker image prune -f

echo -e "${GREEN}🎉 Deployment completed successfully!${NC}"
```

#### File: `scripts/backup.sh`

```bash
#!/bin/bash
# Database backup script

BACKUP_DIR="./database/backup"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="trivaro_backup_$TIMESTAMP.gz"

echo "Creating backup: $BACKUP_FILE"

# Create backup directory if it doesn't exist
mkdir -p $BACKUP_DIR

# Backup MongoDB
mongodump --uri="$MONGODB_URI" --gzip --archive="$BACKUP_DIR/$BACKUP_FILE"

# Keep only last 7 days of backups
find $BACKUP_DIR -name "trivaro_backup_*.gz" -mtime +7 -delete

echo "Backup completed: $BACKUP_DIR/$BACKUP_FILE"

# Upload to S3 (optional)
if [ ! -z "$AWS_S3_BUCKET" ]; then
    aws s3 cp "$BACKUP_DIR/$BACKUP_FILE" "s3://$AWS_S3_BUCKET/backups/"
    echo "Backup uploaded to S3"
fi
```

---

---

## 13. COMPLIANCE & LEGAL

### Important Considerations

1. **Terms of Service**:
   - Clear challenge rules
   - Refund policy
   - Data usage policy
   - Risk disclaimers

2. **Privacy Policy**:
   - GDPR compliance
   - Data retention policies
   - Cookie policy

3. **KYC/AML**:
   - Identity verification for funded accounts
   - Document storage and verification
   - Suspicious activity monitoring

4. **Financial Regulations**:
   - Check local regulations for prop trading
   - Consult with legal team
   - Proper licensing if required

---

## 14. LAUNCH CHECKLIST

### Pre-Launch
- [ ] Complete frontend development
- [ ] Complete backend development
- [ ] Doprime integration tested
- [ ] Payment gateways configured
- [ ] Email system operational
- [ ] Admin panel functional
- [ ] Security audit completed
- [ ] Load testing completed
- [ ] Legal documents ready (T&C, Privacy Policy)
- [ ] Customer support system set up
- [ ] Marketing materials prepared

### Soft Launch
- [ ] Beta testing with 10-20 users
- [ ] Gather feedback
- [ ] Fix critical bugs
- [ ] Optimize performance

### Full Launch
- [ ] Public announcement
- [ ] Marketing campaign
- [ ] Monitor system performance
- [ ] 24/7 support availability
- [ ] Regular backups verified

---

## 15. FUTURE ENHANCEMENTS

### Phase 2 Features
- Mobile app (React Native / Flutter)
- Social trading / Copy trading
- Leaderboards
- Affiliate program
- Multiple broker support
- Live trading competitions
- Educational content / Academy
- Advanced analytics and AI insights
- Multi-currency support

---

## 16. COST ESTIMATION

### Development Costs (Approximate)
- **Full-stack developer (3-6 months)**: $30,000 - $90,000
- **UI/UX Designer**: $5,000 - $15,000
- **DevOps Engineer**: $5,000 - $10,000
- **Security Audit**: $3,000 - $10,000
- **Legal Consultation**: $2,000 - $5,000

### Monthly Operating Costs
- **Server Hosting**: $100 - $500
- **Database (MongoDB Atlas)**: $50 - $300
- **MetaAPI / Broker API**: $50 - $200
- **Email Service (SendGrid)**: $20 - $100
- **Payment Gateway Fees**: 2.9% + $0.30 per transaction
- **SSL Certificates**: Free (Let's Encrypt)
- **Backup Storage**: $20 - $50
- **Total**: ~$500 - $2,000/month (scales with users)

---

## 17. SUCCESS METRICS

### KPIs to Track
- User registration rate
- Challenge purchase conversion rate
- Phase 1 pass rate
- Phase 2 pass rate
- Average time to complete phases
- User retention rate
- Monthly recurring revenue
- Customer acquisition cost
- Payout accuracy rate
- Support ticket resolution time
- System uptime (target: 99.9%)

---

## FINAL NOTES

This is a complex project requiring expertise in:
- Full-stack web development
- Trading platform integration
- Real-time data processing
- Financial systems
- Security best practices

**Recommended Development Approach**:
1. Start with MVP (Minimum Viable Product):
   - User registration & auth
   - Single account size
   - Balance-based type only
   - Basic rule monitoring
   - Manual account creation (Phase 1)

2. Iterate and add features:
   - Automated account creation
   - Equity-based type
   - Advanced analytics
   - Admin panel enhancements

3. Scale and optimize:
   - Performance optimization
   - Advanced features
   - Mobile apps

**Contact Doprime**: Before starting development, contact Doprime support to:
- Confirm demo account API availability
- Get API documentation
- Understand rate limits
- Discuss partnership opportunities

---

## ADDITIONAL RESOURCES

### Similar Platforms to Study
- FTMO: https://ftmo.com
- The5%ers: https://the5ers.com
- MyForexFunds: https://myforexfunds.com
- FundedNext: https://fundednext.com
- Naira Trader: (as mentioned in your brief)

### Development Tools
- VS Code with extensions
- Postman (API testing)
- MongoDB Compass
- Git & GitHub
- Docker (containerization)
- PM2 (process management)

### Learning Resources
- MetaAPI Documentation: https://metaapi.cloud/docs
- Stripe Documentation: https://stripe.com/docs
- React Documentation: https://react.dev
- Node.js Best Practices: https://github.com/goldbergyoni/nodebestpractices

---

**Good luck with your Trivaro Prop Firm project! This is a comprehensive guide to help you build a world-class proprietary trading platform.**

---

## 18. HOW TO USE THIS PROMPT WITH AI ASSISTANTS

### Effective Prompting Strategy

This document is designed to be used with AI coding assistants (like Claude, ChatGPT, or GitHub Copilot) to build your prop firm platform efficiently. Here's how to get the best results:

#### Phase 1: Initial Setup & Configuration

**Prompt Template:**
```
I'm building a prop firm trading platform called Trivaro. Please help me set up the initial project structure.

Context: [Paste relevant sections from this document]

Task: Create the complete file structure for [frontend/backend] with all necessary configuration files including package.json, .env.example, and initial setup files.

Requirements:
- Use the exact file structure specified in Section 1.5
- Include all dependencies listed in the technology stack
- Add proper comments and documentation
- Follow the naming conventions specified
```

#### Phase 2: Database Models

**Prompt Template:**
```
I need to create the database models for my Trivaro prop firm platform.

Context: [Paste Section 6: DATABASE SCHEMA]

Task: Create the following model files:
- backend/src/models/User.js
- backend/src/models/Challenge.js
- backend/src/models/Trade.js
- backend/src/models/Transaction.js
- backend/src/models/Payout.js

Requirements:
- Use Mongoose schemas as specified
- Include all validations
- Add indexes for performance
- Include instance methods and statics where needed
- Add comprehensive comments
```

#### Phase 3: Core Backend Services

**Prompt Template:**
```
Create the broker integration service for Trivaro.

Context: [Paste Section 7: DOPRIME INTEGRATION - specifically the brokerService.js file]

Task: Implement the complete backend/src/services/brokerService.js file

Requirements:
- Follow the exact structure provided
- Include all methods specified
- Add proper error handling
- Include logging
- Add JSDoc comments
- Handle edge cases
```

**For the Critical Rule Engine:**
```
Create the rule validation engine for Trivaro prop firm.

Context: [Paste Section 7: DOPRIME INTEGRATION - specifically the ruleEngine.js file and Section 4: ACCOUNT TYPES & TRADING RULES]

Task: Implement backend/src/services/ruleEngine.js

CRITICAL: This is the most important file in the system. It must:
- Correctly implement balance-based drawdown calculations (static from initial balance)
- Correctly implement equity-based drawdown calculations (trailing from highest equity)
- Handle daily drawdown resets properly
- Check profit targets accurately
- Validate minimum trading days
- Check consistency rules for equity-based accounts
- Include comprehensive logging

Requirements:
- Use the exact formulas provided in Section 4
- Include examples from the documentation
- Add unit test cases
- Handle timezone issues (UTC)
```

#### Phase 4: API Routes & Controllers

**Prompt Template:**
```
Create the challenge management API endpoints.

Context: [Paste relevant sections about challenge management]

Task: Create both the route file and controller file:
- backend/src/routes/challenge.routes.js
- backend/src/controllers/challengeController.js

Endpoints needed:
- POST /api/challenges/purchase
- GET /api/challenges/user/:userId
- GET /api/challenges/:id
- GET /api/challenges/:id/trades
- GET /api/challenges/:id/statistics
- POST /api/challenges/:id/payout

Requirements:
- Include authentication middleware
- Add request validation
- Implement proper error handling
- Follow REST conventions
- Add rate limiting where appropriate
```

#### Phase 5: Frontend Components

**Prompt Template:**
```
Create the equity chart component for the trading dashboard.

Context: [Paste Section 9: FRONTEND FEATURES - EquityChart.jsx]

Task: Implement frontend/src/components/challenge/EquityChart.jsx

Requirements:
- Use Recharts as specified
- Implement real-time WebSocket updates
- Show both equity and balance lines
- Display drawdown limit reference line
- Include the summary cards at bottom
- Use the color scheme from Section 2
- Make it responsive
- Add loading states
```

**For Complex Components:**
```
Create the rule status indicator component with visual progress bars.

Context: [Paste Section 9: FRONTEND FEATURES - RuleStatusIndicator.jsx and Section 4: ACCOUNT TYPES]

Task: Implement frontend/src/components/challenge/RuleStatusIndicator.jsx

Requirements:
- Calculate status for all rules dynamically
- Show different calculations for balance-based vs equity-based
- Use color coding (green=safe, red=violated, yellow=warning)
- Include progress bars
- Display current values and limits
- Show overall status summary
- Handle both account types correctly
```

#### Phase 6: WebSocket Implementation

**Prompt Template:**
```
Implement the WebSocket infrastructure for real-time updates.

Context: [Paste WebSocket sections and real-time update requirements]

Task: Create the complete WebSocket setup including:
- backend/src/websocket/socketServer.js
- backend/src/websocket/tradeEvents.js
- frontend/src/hooks/useWebSocket.js

Requirements:
- Implement Socket.io on backend
- Handle authentication
- Create room-based messaging
- Emit trade updates, equity changes, notifications
- Implement reconnection logic
- Handle disconnections gracefully
```

#### Phase 7: Scheduled Jobs

**Prompt Template:**
```
Create the cron job for syncing trades from the broker.

Context: [Paste Section 7: syncTrades.job.js and related broker service code]

Task: Implement backend/src/jobs/syncTrades.job.js

Requirements:
- Run every 5 minutes
- Fetch new trades from all active challenges
- Update database
- Emit WebSocket events for real-time updates
- Handle errors per challenge (don't stop entire job if one fails)
- Include comprehensive logging
```

#### Phase 8: Testing

**Prompt Template:**
```
Create unit tests for the rule engine.

Context: [Paste the ruleEngine.js implementation]

Task: Create backend/tests/unit/ruleEngine.test.js

Test cases needed:
- Balance-based max drawdown (should fail at $90k for $100k account)
- Balance-based daily drawdown (should fail at $95k for $100k account)
- Equity-based trailing drawdown (should update as equity grows)
- Equity-based daily drawdown (should reset daily)
- Profit target achievement
- Consistency rule (40% rule)
- Minimum trading days

Use Jest framework and include:
- Mock data
- Edge cases
- Timezone handling
- Floating point precision
```

### File-Specific Prompting Tips

1. **When creating configuration files** (.env, config/*.js):
   - Always reference Section 10.5 for exact variable names
   - Include all security-related variables
   - Add comments explaining each variable

2. **When creating models** (models/*.js):
   - Reference Section 6 for exact schema structure
   - Include all indexes
   - Add validation rules
   - Include timestamps

3. **When creating services** (services/*.js):
   - Include proper error handling
   - Add logging at key points
   - Use async/await consistently
   - Export as singleton where appropriate

4. **When creating frontend components**:
   - Reference Section 2 for color scheme
   - Use Tailwind classes consistently
   - Implement loading and error states
   - Make components responsive
   - Add prop types or TypeScript types

5. **When creating API routes**:
   - Include middleware stack (auth, validation, rate limiting)
   - Follow RESTful conventions
   - Add comprehensive error messages
   - Include request/response examples in comments

### Iterative Development Approach

**Step 1:** Create file structure
```
"Create the complete project structure as specified in Section 1.5. Just create empty files with proper comments indicating what each file will contain."
```

**Step 2:** Implement one feature at a time
```
"Now implement the [specific feature] in [specific file]. Follow the exact specification from Section [X]."
```

**Step 3:** Test and refine
```
"Create tests for [feature] and handle edge cases like [specific scenario]."
```

**Step 4:** Integration
```
"Now integrate [feature A] with [feature B]. Ensure they communicate properly via [method]."
```

### Common Pitfalls to Avoid

1. **Don't skip the rule engine accuracy**: The rule engine is CRITICAL. Test it thoroughly with various scenarios.

2. **Timezone handling**: All daily resets should happen at midnight UTC. Make this explicit in prompts.

3. **Security**: Always mention encryption for sensitive data, validation for inputs, authentication for routes.

4. **Real-time updates**: Specify whether data should come from WebSocket or API calls.

5. **Error handling**: Request comprehensive error handling and logging in every prompt.

### Example Complete Feature Prompt

```
I need to implement the complete challenge purchase flow for Trivaro.

Context:
[Paste Section 5.1: User Flow]
[Paste relevant database schemas]
[Paste payment integration requirements]

Task: Implement the full purchase workflow including:

Backend:
1. POST /api/challenges/purchase endpoint
2. Payment processing with Stripe
3. Automatic demo account creation via Doprime API
4. Credential encryption and storage
5. Email sending with credentials
6. WebSocket notification to user

Frontend:
1. Account size selector component
2. Account type comparison (balance vs equity)
3. Payment form with Stripe Elements
4. Order confirmation page
5. Redirect to dashboard after purchase

Requirements:
- Handle payment failures gracefully
- Rollback account creation if payment fails
- Send confirmation email with encrypted credentials
- Create initial Challenge document in database
- Emit WebSocket event for real-time dashboard update
- Include comprehensive error handling
- Add loading states throughout
- Validate all inputs
- Use exact file names specified in Section 1.5
- Follow color scheme from Section 2
- Include proper logging

Files to create/modify:
Backend:
- backend/src/controllers/challengeController.js (purchaseChallenge function)
- backend/src/services/paymentService.js (processPayment function)
- backend/src/services/brokerService.js (createDemoAccount function)
- backend/src/services/emailService.js (sendCredentialsEmail function)

Frontend:
- frontend/src/pages/PurchaseChallenge.jsx
- frontend/src/components/purchase/AccountSizeSelector.jsx
- frontend/src/components/purchase/CheckoutForm.jsx
- frontend/src/components/purchase/OrderConfirmation.jsx
```

### Final Tips

1. **Be specific about file paths**: Always use complete paths like `backend/src/services/ruleEngine.js`

2. **Reference sections**: Point to specific sections of this document for context

3. **Include acceptance criteria**: Specify exactly what should work when the code is complete

4. **Request tests**: Always ask for unit tests alongside implementation

5. **Iterate**: Build one feature completely before moving to the next

6. **Ask for review**: Request the AI to review code for security issues, performance problems, or edge cases

This document is your blueprint. Use it section by section, file by file, to build Trivaro systematically. Good luck! 🚀
```
