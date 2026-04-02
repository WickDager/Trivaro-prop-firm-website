/**
 * Challenge Model
 * Represents a trading challenge in the Trivaro Prop Firm platform
 */

const mongoose = require('mongoose');

const challengeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  accountSize: {
    type: Number,
    required: true,
    enum: [5000, 10000, 25000, 50000, 100000]
  },
  accountType: {
    type: String,
    required: true,
    enum: ['balance-based', 'equity-based']
  },
  phase: {
    type: Number,
    required: true,
    enum: [1, 2, 3], // 1: Phase 1, 2: Phase 2, 3: Funded
    default: 1
  },
  status: {
    type: String,
    required: true,
    enum: ['active', 'passed', 'failed', 'pending', 'deleted'],
    default: 'pending'
  },

  // Trading account details
  mt4Login: {
    type: String,
    unique: true,
    sparse: true
  },
  mt4Password: {
    type: String,
    select: false // Don't include in queries by default
  },
  mt4Server: String,
  broker: {
    type: String,
    default: 'doprime'
  },

  // Initial parameters
  initialBalance: {
    type: Number,
    required: true
  },
  profitTarget: {
    type: Number,
    required: true
  },
  maxDrawdown: {
    type: Number,
    required: true
  },
  dailyDrawdownLimit: {
    type: Number,
    required: true
  },

  // Current state
  currentBalance: {
    type: Number,
    default: 0
  },
  currentEquity: {
    type: Number,
    default: 0
  },
  highestEquity: {
    type: Number,
    default: 0
  }, // For equity-based trailing
  dailyStartEquity: {
    type: Number,
    default: 0
  }, // Reset daily
  totalProfit: {
    type: Number,
    default: 0
  },
  totalLoss: {
    type: Number,
    default: 0
  },

  // Performance tracking
  tradingDays: {
    type: Number,
    default: 0
  },
  totalTrades: {
    type: Number,
    default: 0
  },
  winningTrades: {
    type: Number,
    default: 0
  },
  losingTrades: {
    type: Number,
    default: 0
  },
  largestWin: {
    type: Number,
    default: 0
  },
  largestLoss: {
    type: Number,
    default: 0
  },
  winRate: {
    type: Number,
    default: 0
  },
  averageWin: {
    type: Number,
    default: 0
  },
  averageLoss: {
    type: Number,
    default: 0
  },
  profitFactor: {
    type: Number,
    default: 0
  },

  // Rule tracking
  rulesViolated: [{
    type: String
  }],
  violationDate: Date,
  violationReason: String,

  // Phase progression
  phaseCompletedAt: Date,
  fundedAt: Date,

  // Dates
  startDate: Date,
  endDate: Date,
  deletionScheduledDate: Date,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for performance
challengeSchema.index({ userId: 1 });
challengeSchema.index({ status: 1 });
challengeSchema.index({ phase: 1 });
challengeSchema.index({ accountType: 1 });
challengeSchema.index({ mt4Login: 1 });
challengeSchema.index({ createdAt: -1 });

// Compound indexes
challengeSchema.index({ userId: 1, status: 1 });
challengeSchema.index({ userId: 1, phase: 1 });

// Virtual for user
challengeSchema.virtual('user', {
  ref: 'User',
  localField: 'userId',
  foreignField: '_id'
});

// Virtual for trades
challengeSchema.virtual('trades', {
  ref: 'Trade',
  localField: '_id',
  foreignField: 'challengeId'
});

// Method to calculate profit percentage
challengeSchema.methods.getProfitPercentage = function() {
  return ((this.currentBalance - this.initialBalance) / this.initialBalance) * 100;
};

// Method to calculate drawdown percentage
challengeSchema.methods.getDrawdownPercentage = function() {
  if (this.accountType === 'balance-based') {
    return ((this.initialBalance - this.currentBalance) / this.initialBalance) * 100;
  } else {
    const highWaterMark = Math.max(this.highestEquity, this.initialBalance);
    return ((highWaterMark - this.currentEquity) / highWaterMark) * 100;
  }
};

// Method to check if profit target is reached
challengeSchema.methods.isProfitTargetReached = function() {
  const currentProfit = this.currentBalance - this.initialBalance;
  return currentProfit >= this.profitTarget;
};

// Static method to get active challenges count
challengeSchema.statics.getActiveChallengesCount = async function(userId) {
  return await this.countDocuments({ userId, status: 'active' });
};

// Static method to get challenges by status
challengeSchema.statics.getChallengesByStatus = async function(status) {
  return await this.find({ status }).populate('userId', 'email firstName lastName');
};

module.exports = mongoose.model('Challenge', challengeSchema);
