/**
 * Trade Model
 * Represents a single trade in a challenge
 */

const mongoose = require('mongoose');

const tradeSchema = new mongoose.Schema({
  challengeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Challenge',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  ticketNumber: {
    type: Number,
    required: true
  },
  symbol: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    required: true,
    enum: ['buy', 'sell']
  },
  volume: {
    type: Number,
    required: true
  },
  openPrice: {
    type: Number,
    required: true
  },
  closePrice: {
    type: Number,
    default: null
  },
  openTime: {
    type: Date,
    required: true
  },
  closeTime: {
    type: Date,
    default: null
  },
  profit: {
    type: Number,
    default: 0
  },
  commission: {
    type: Number,
    default: 0
  },
  swap: {
    type: Number,
    default: 0
  },
  comment: {
    type: String,
    default: ''
  },
  magic: {
    type: Number,
    default: 0
  },
  sl: {
    type: Number,
    default: null
  },
  tp: {
    type: Number,
    default: null
  },
  isOpen: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for performance
tradeSchema.index({ challengeId: 1 });
tradeSchema.index({ userId: 1 });
tradeSchema.index({ ticketNumber: 1 });
tradeSchema.index({ symbol: 1 });
tradeSchema.index({ openTime: -1 });
tradeSchema.index({ closeTime: -1 });
tradeSchema.index({ isOpen: 1 });

// Compound indexes
tradeSchema.index({ challengeId: 1, isOpen: 1 });
tradeSchema.index({ challengeId: 1, closeTime: -1 });
tradeSchema.index({ userId: 1, openTime: -1 });

// Virtual for challenge
tradeSchema.virtual('challenge', {
  ref: 'Challenge',
  localField: 'challengeId',
  foreignField: '_id'
});

// Method to calculate net profit
tradeSchema.methods.getNetProfit = function() {
  return this.profit + this.commission + this.swap;
};

// Static method to get closed trades for a challenge
tradeSchema.statics.getClosedTrades = async function(challengeId) {
  return await this.find({ challengeId, isOpen: false }).sort({ closeTime: -1 });
};

// Static method to get open trades for a challenge
tradeSchema.statics.getOpenTrades = async function(challengeId) {
  return await this.find({ challengeId, isOpen: true });
};

// Static method to get trades by date range
tradeSchema.statics.getTradesByDateRange = async function(challengeId, startDate, endDate) {
  return await this.find({
    challengeId,
    closeTime: { $gte: startDate, $lte: endDate },
    isOpen: false
  }).sort({ closeTime: -1 });
};

// Static method to calculate statistics
tradeSchema.statics.calculateStatistics = async function(challengeId) {
  const trades = await this.find({ challengeId, isOpen: false });
  
  if (trades.length === 0) {
    return {
      totalTrades: 0,
      winningTrades: 0,
      losingTrades: 0,
      winRate: 0,
      totalProfit: 0,
      totalLoss: 0,
      largestWin: 0,
      largestLoss: 0,
      averageWin: 0,
      averageLoss: 0,
      profitFactor: 0
    };
  }

  const winningTrades = trades.filter(t => t.profit > 0);
  const losingTrades = trades.filter(t => t.profit <= 0);
  
  const totalProfit = winningTrades.reduce((sum, t) => sum + t.profit, 0);
  const totalLoss = Math.abs(losingTrades.reduce((sum, t) => sum + t.profit, 0));
  
  const largestWin = Math.max(...winningTrades.map(t => t.profit), 0);
  const largestLoss = Math.min(...losingTrades.map(t => t.profit), 0);
  
  return {
    totalTrades: trades.length,
    winningTrades: winningTrades.length,
    losingTrades: losingTrades.length,
    winRate: (winningTrades.length / trades.length) * 100,
    totalProfit,
    totalLoss,
    largestWin,
    largestLoss,
    averageWin: winningTrades.length > 0 ? totalProfit / winningTrades.length : 0,
    averageLoss: losingTrades.length > 0 ? totalLoss / losingTrades.length : 0,
    profitFactor: totalLoss > 0 ? totalProfit / totalLoss : totalProfit
  };
};

module.exports = mongoose.model('Trade', tradeSchema);
