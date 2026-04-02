# Trivaro Prop Firm

A complete full-stack proprietary trading firm platform that evaluates forex traders through a two-phase challenge system using demo accounts from Doprime broker.

## 🚀 Features

- **Two-Phase Challenge System**: Balance-based and Equity-based account types
- **Real-time Trading Monitoring**: WebSocket integration for live equity updates
- **Automated Rule Enforcement**: Daily drawdown, max drawdown, profit targets
- **Payment Integration**: Stripe and PayPal support
- **Admin Dashboard**: Complete user and challenge management
- **Email Notifications**: Automated emails for all challenge events
- **Responsive Design**: Mobile-friendly React frontend

## 📁 Project Structure

```
trivaro-prop-firm/
├── backend/          # Node.js/Express backend API
├── frontend/         # React/Vite frontend application
├── docker/           # Docker configuration files
├── nginx/            # Nginx configuration
├── database/         # Database migrations and seeds
├── scripts/          # Deployment and utility scripts
├── docs/             # Documentation
└── docs/             # Documentation
```

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Caching**: Redis
- **Authentication**: JWT with refresh tokens
- **Real-time**: Socket.io
- **Broker Integration**: MetaAPI.cloud

### Frontend
- **Framework**: React 18 with Vite
- **Styling**: Tailwind CSS + shadcn/ui
- **State Management**: Redux Toolkit
- **Charts**: Recharts
- **HTTP Client**: Axios

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- MongoDB 6.0+
- Redis 7+
- Docker (optional, for containerized deployment)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/trivaro/prop-firm.git
cd prop-firm
```

2. **Install all dependencies**
```bash
npm run install:all
```

3. **Configure environment variables**

Copy the example environment files and fill in your values:
```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

4. **Start development servers**
```bash
npm run dev
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 📖 Documentation

- [API Documentation](docs/API.md)
- [Deployment Guide](docs/DEPLOYMENT.md)
- [Security Guidelines](docs/SECURITY.md)
- [Contributing Guidelines](docs/CONTRIBUTING.md)

## 🔧 Configuration

### Account Types

1. **Balance-Based**: Drawdown calculated from initial balance (static)
   - Phase 1: 10% profit target, 10% max drawdown, 5% daily limit
   - Phase 2: 5% profit target, 10% max drawdown, 5% daily limit

2. **Equity-Based**: Drawdown trails from highest equity (dynamic)
   - Phase 1: 10% profit target, 10% trailing drawdown, 5% daily limit
   - Phase 2: 5% profit target, 10% trailing drawdown, 5% daily limit

### Account Sizes

- $5,000 - Entry level
- $10,000 - Beginner friendly
- $25,000 - Intermediate
- $50,000 - Advanced
- $100,000 - Professional

## 🧪 Testing

```bash
# Run all tests
npm test

# Backend tests only
npm run test:backend

# Frontend tests only
npm run test:frontend
```

## 🐳 Docker Deployment

```bash
# Build and start all services
npm run docker:up

# Stop all services
npm run docker:down

# Rebuild containers
npm run docker:build
```

## 📊 Key Features

### Challenge Management
- Automatic demo account creation via Doprime API
- Real-time trade synchronization (every 5 minutes)
- Automated rule violation detection
- Phase progression handling

### Trading Rules
- Maximum overall drawdown: 10%
- Daily drawdown limit: 5%
- Minimum trading days: 5
- Profit targets: 10% (Phase 1), 5% (Phase 2)
- Consistency rule: 40% max for single day (equity-based)

### Security
- AES-256 encryption for sensitive data
- JWT authentication with refresh tokens
- Rate limiting on all endpoints
- Input validation with Joi/Zod
- CORS protection
- HTTPS enforcement

## 💰 Payment Integration

- **Stripe**: Credit/debit cards
- **PayPal**: PayPal payments
- **Cryptocurrency**: Optional (Coinbase Commerce)

## 📧 Email Service

- SendGrid integration for transactional emails
- Templates for:
  - Welcome emails
  - Challenge credentials
  - Phase completion
  - Rule violations
  - Payout confirmations

## 🎨 Color Scheme

- **Primary**: Deep Navy Blue (#0A1628)
- **Secondary**: Bright Teal (#00D9FF)
- **Accent**: Electric Green (#00FF88)
- **Error**: Vibrant Red (#FF3B57)
- **Background**: Dark Charcoal (#0F1419)

## 🤝 Contributing

Please read our [Contributing Guidelines](docs/CONTRIBUTING.md) before submitting pull requests.

## 📄 License

This project is proprietary software. All rights reserved.

## 📞 Support

- Email: support@trivaro.com
- Documentation: https://docs.trivaro.com

## ⚠️ Disclaimer

This platform is for educational and demonstration purposes. Trading forex involves substantial risk of loss and is not suitable for all investors. Past performance does not guarantee future results.

---

Built with ❤️ by Trivaro
