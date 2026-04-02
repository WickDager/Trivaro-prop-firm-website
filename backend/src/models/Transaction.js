/**
 * Transaction Model
 * Represents a financial transaction (payment, refund, etc.)
 */

const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  challengeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Challenge',
    default: null
  },
  type: {
    type: String,
    required: true,
    enum: [
      'challenge_purchase',
      'payout',
      'refund',
      'subscription',
      'bonus',
      'fee'
    ]
  },
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    required: true,
    default: 'USD',
    uppercase: true
  },
  paymentMethod: {
    type: String,
    required: true,
    enum: ['stripe', 'paypal', 'crypto', 'bank_transfer', 'manual']
  },
  paymentStatus: {
    type: String,
    required: true,
    enum: ['pending', 'completed', 'failed', 'refunded', 'cancelled'],
    default: 'pending'
  },
  paymentGatewayId: {
    type: String, // Stripe payment intent ID, PayPal transaction ID, etc.
    default: ''
  },
  invoiceUrl: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  },
  metadata: {
    type: Object,
    default: {}
  },
  processedAt: Date,
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
transactionSchema.index({ userId: 1 });
transactionSchema.index({ challengeId: 1 });
transactionSchema.index({ type: 1 });
transactionSchema.index({ paymentStatus: 1 });
transactionSchema.index({ createdAt: -1 });
transactionSchema.index({ paymentGatewayId: 1 });

// Compound indexes
transactionSchema.index({ userId: 1, createdAt: -1 });
transactionSchema.index({ userId: 1, paymentStatus: 1 });

// Virtual for user
transactionSchema.virtual('user', {
  ref: 'User',
  localField: 'userId',
  foreignField: '_id'
});

// Virtual for challenge
transactionSchema.virtual('challenge', {
  ref: 'Challenge',
  localField: 'challengeId',
  foreignField: '_id'
});

// Method to format amount
transactionSchema.methods.getFormattedAmount = function() {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: this.currency
  }).format(this.amount);
};

// Static method to get transactions by user
transactionSchema.statics.getUserTransactions = async function(userId, limit = 50) {
  return await this.find({ userId })
    .populate('challengeId', 'accountSize phase status')
    .sort({ createdAt: -1 })
    .limit(limit);
};

// Static method to get total revenue
transactionSchema.statics.getTotalRevenue = async function(startDate, endDate) {
  const result = await this.aggregate([
    {
      $match: {
        type: 'challenge_purchase',
        paymentStatus: 'completed',
        createdAt: { $gte: startDate, $lte: endDate }
      }
    },
    {
      $group: {
        _id: null,
        total: { $sum: '$amount' }
      }
    }
  ]);
  
  return result.length > 0 ? result[0].total : 0;
};

module.exports = mongoose.model('Transaction', transactionSchema);
