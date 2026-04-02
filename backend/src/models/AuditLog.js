/**
 * AuditLog Model
 * Tracks administrative actions and system events for security and compliance
 */

const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  action: {
    type: String,
    required: true,
    enum: [
      'login',
      'logout',
      'password_change',
      'profile_update',
      'kyc_submit',
      'kyc_approve',
      'kyc_reject',
      'challenge_purchase',
      'challenge_delete',
      'payout_request',
      'payout_approve',
      'payout_reject',
      'payout_pay',
      'user_ban',
      'user_unban',
      'role_change',
      'settings_change',
      'system_event',
      'api_call',
      'export_data'
    ]
  },
  entity: {
    type: String,
    default: ''
  },
  entityId: {
    type: mongoose.Schema.Types.ObjectId,
    default: null
  },
  description: {
    type: String,
    required: true
  },
  ipAddress: {
    type: String,
    default: ''
  },
  userAgent: {
    type: String,
    default: ''
  },
  changes: {
    type: Object,
    default: {}
    // Before and after values for updates
  },
  metadata: {
    type: Object,
    default: {}
  },
  status: {
    type: String,
    enum: ['success', 'failure', 'pending'],
    default: 'success'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for performance
auditLogSchema.index({ userId: 1 });
auditLogSchema.index({ action: 1 });
auditLogSchema.index({ entity: 1 });
auditLogSchema.index({ entityId: 1 });
auditLogSchema.index({ createdAt: -1 });
auditLogSchema.index({ status: 1 });

// Compound indexes
auditLogSchema.index({ userId: 1, createdAt: -1 });
auditLogSchema.index({ entity: 1, entityId: 1 });

// Virtual for user
auditLogSchema.virtual('user', {
  ref: 'User',
  localField: 'userId',
  foreignField: '_id'
});

// Static method to get logs by user
auditLogSchema.statics.getUserLogs = async function(userId, limit = 100) {
  return await this.find({ userId })
    .sort({ createdAt: -1 })
    .limit(limit);
};

// Static method to get logs by action
auditLogSchema.statics.getLogsByAction = async function(action, limit = 100) {
  return await this.find({ action })
    .sort({ createdAt: -1 })
    .limit(limit);
};

// Static method to get logs by date range
auditLogSchema.statics.getLogsByDateRange = async function(startDate, endDate, limit = 1000) {
  return await this.find({
    createdAt: { $gte: startDate, $lte: endDate }
  })
    .sort({ createdAt: -1 })
    .limit(limit);
};

// Static method to get logs for entity
auditLogSchema.statics.getEntityLogs = async function(entity, entityId) {
  return await this.find({ entity, entityId })
    .sort({ createdAt: -1 });
};

// Static method to delete old logs (for compliance)
auditLogSchema.statics.deleteOldLogs = async function(daysOld = 365) {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysOld);
  
  return await this.deleteMany({
    createdAt: { $lt: cutoffDate }
  });
};

module.exports = mongoose.model('AuditLog', auditLogSchema);
