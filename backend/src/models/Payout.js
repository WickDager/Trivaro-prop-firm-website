/**
 * Payout Model
 * Represents a payout request from a funded trader
 */

const mongoose = require('mongoose');

const payoutSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  challengeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Challenge',
    required: true
  },
  requestedAmount: {
    type: Number,
    required: true,
    min: 0
  },
  approvedAmount: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'approved', 'rejected', 'paid', 'cancelled'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    required: true,
    enum: ['bank_transfer', 'crypto', 'paypal', 'stripe']
  },
  paymentDetails: {
    type: Object,
    default: {}
    // Bank account, crypto wallet, PayPal email, etc.
  },
  profitSplit: {
    type: Number,
    default: 80 // 80% trader / 20% firm
  },
  periodStart: {
    type: Date,
    required: true
  },
  periodEnd: {
    type: Date,
    required: true
  },
  traderProfit: {
    type: Number,
    default: 0
  },
  notes: {
    type: String,
    default: ''
  },
  rejectionReason: {
    type: String,
    default: ''
  },
  requestedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  paidBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  requestDate: {
    type: Date,
    default: Date.now
  },
  approvalDate: Date,
  paymentDate: Date,
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
payoutSchema.index({ userId: 1 });
payoutSchema.index({ challengeId: 1 });
payoutSchema.index({ status: 1 });
payoutSchema.index({ requestDate: -1 });

// Compound indexes
payoutSchema.index({ userId: 1, status: 1 });
payoutSchema.index({ challengeId: 1, status: 1 });

// Virtual for user
payoutSchema.virtual('user', {
  ref: 'User',
  localField: 'userId',
  foreignField: '_id'
});

// Virtual for challenge
payoutSchema.virtual('challenge', {
  ref: 'Challenge',
  localField: 'challengeId',
  foreignField: '_id'
});

// Method to calculate trader's share
payoutSchema.methods.calculateTraderShare = function() {
  return this.traderProfit * (this.profitSplit / 100);
};

// Method to get formatted amount
payoutSchema.methods.getFormattedAmount = function() {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(this.approvedAmount);
};

// Static method to get pending payouts
payoutSchema.statics.getPendingPayouts = async function() {
  return await this.find({ status: 'pending' })
    .populate('userId', 'email firstName lastName')
    .populate('challengeId', 'accountSize accountType mt4Login')
    .sort({ requestDate: -1 });
};

// Static method to get payouts by user
payoutSchema.statics.getUserPayouts = async function(userId, limit = 50) {
  return await this.find({ userId })
    .populate('challengeId', 'accountSize accountType')
    .sort({ requestDate: -1 })
    .limit(limit);
};

// Static method to get total payouts by period
payoutSchema.statics.getTotalPayoutsByPeriod = async function(startDate, endDate) {
  const result = await this.aggregate([
    {
      $match: {
        status: 'paid',
        paymentDate: { $gte: startDate, $lte: endDate }
      }
    },
    {
      $group: {
        _id: null,
        total: { $sum: '$approvedAmount' }
      }
    }
  ]);
  
  return result.length > 0 ? result[0].total : 0;
};

module.exports = mongoose.model('Payout', payoutSchema);
