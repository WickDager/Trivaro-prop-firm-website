/**
 * Constants
 */

// Account sizes
export const ACCOUNT_SIZES = [
  { value: 5000, label: '$5,000', price: 49 },
  { value: 10000, label: '$10,000', price: 99 },
  { value: 25000, label: '$25,000', price: 199 },
  { value: 50000, label: '$50,000', price: 349 },
  { value: 100000, label: '$100,000', price: 549 },
]

// Account types
export const ACCOUNT_TYPES = [
  {
    value: 'balance-based',
    label: 'Balance-Based',
    description: 'Static drawdown from initial balance',
    features: [
      'Fixed drawdown limits',
      'Ignore floating profits',
      'Easier to manage',
    ],
  },
  {
    value: 'equity-based',
    label: 'Equity-Based',
    description: 'Trailing drawdown from highest equity',
    features: [
      'Dynamic drawdown limits',
      'Trails with profits',
      'More challenging',
    ],
  },
]

// Challenge phases
export const PHASES = {
  1: {
    name: 'Phase 1',
    profitTarget: 10,
    maxDrawdown: 10,
    dailyDrawdown: 5,
    minTradingDays: 5,
  },
  2: {
    name: 'Phase 2',
    profitTarget: 5,
    maxDrawdown: 10,
    dailyDrawdown: 5,
    minTradingDays: 5,
  },
  3: {
    name: 'Funded',
    profitTarget: 0,
    maxDrawdown: 10,
    dailyDrawdown: 5,
    minTradingDays: 0,
  },
}

// Challenge status colors
export const STATUS_COLORS = {
  active: 'text-accent bg-accent/10',
  passed: 'text-green-400 bg-green-400/10',
  failed: 'text-error bg-error/10',
  pending: 'text-yellow-400 bg-yellow-400/10',
  deleted: 'text-gray-400 bg-gray-400/10',
}

// Payment methods
export const PAYMENT_METHODS = [
  { value: 'stripe', label: 'Credit Card', icon: 'credit-card' },
  { value: 'paypal', label: 'PayPal', icon: 'paypal' },
]

// Navigation links
export const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/how-it-works', label: 'How It Works' },
  { href: '/faq', label: 'FAQ' },
]

// Dashboard navigation
export const DASHBOARD_LINKS = [
  { href: '/dashboard', label: 'Dashboard', icon: 'layout-dashboard' },
  { href: '/purchase', label: 'Buy Challenge', icon: 'shopping-cart' },
  { href: '/profile', label: 'Profile', icon: 'user' },
]

// Admin navigation
export const ADMIN_LINKS = [
  { href: '/admin', label: 'Overview', icon: 'layout-dashboard' },
  { href: '/admin/users', label: 'Users', icon: 'users' },
  { href: '/admin/challenges', label: 'Challenges', icon: 'trophy' },
  { href: '/admin/payouts', label: 'Payouts', icon: 'dollar-sign' },
]
