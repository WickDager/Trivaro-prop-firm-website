/**
 * Admin Controller
 * Handles admin-related requests
 */

const Challenge = require('../models/Challenge');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const Payout = require('../models/Payout');
const AuditLog = require('../models/AuditLog');
const logger = require('../utils/logger');
const asyncHandler = require('../utils/asyncHandler');

/**
 * Get dashboard statistics
 * GET /api/admin/stats
 */
const getStats = asyncHandler(async (req, res) => {
  // Get counts
  const totalUsers = await User.countDocuments();
  const activeUsers = await User.countDocuments({ isActive: true });
  const totalChallenges = await Challenge.countDocuments();
  const activeChallenges = await Challenge.countDocuments({ status: 'active' });
  const totalRevenue = await Transaction.aggregate([
    { $match: { type: 'challenge_purchase', paymentStatus: 'completed' } },
    { $group: { _id: null, total: { $sum: '$amount' } } }
  ]);
  const totalPayouts = await Payout.aggregate([
    { $match: { status: 'paid' } },
    { $group: { _id: null, total: { $sum: '$approvedAmount' } } }
  ]);

  res.json({
    success: true,
    data: {
      users: {
        total: totalUsers,
        active: activeUsers
      },
      challenges: {
        total: totalChallenges,
        active: activeChallenges
      },
      financial: {
        totalRevenue: totalRevenue[0]?.total || 0,
        totalPayouts: totalPayouts[0]?.total || 0
      }
    }
  });
});

/**
 * Get all users
 * GET /api/admin/users
 */
const getUsers = asyncHandler(async (req, res) => {
  const { page = 1, limit = 50, status } = req.query;

  const query = {};
  if (status) {
    query.isActive = status === 'active';
  }

  const users = await User.find(query)
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const count = await User.countDocuments(query);

  res.json({
    success: true,
    data: {
      users,
      pagination: {
        total: count,
        page: parseInt(page),
        pages: Math.ceil(count / limit)
      }
    }
  });
});

/**
 * Update user
 * PUT /api/admin/users/:id
 */
const updateUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { isActive, role, kycStatus } = req.body;

  const user = await User.findById(id);
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }

  if (isActive !== undefined) user.isActive = isActive;
  if (role !== undefined) user.role = role;
  if (kycStatus !== undefined) user.kycStatus = kycStatus;

  await user.save();

  // Log audit
  await AuditLog.create({
    userId: req.user.userId,
    action: 'user_update',
    description: `Admin updated user ${user.email}`,
    changes: { isActive, role, kycStatus }
  });

  res.json({
    success: true,
    message: 'User updated successfully',
    data: user
  });
});

/**
 * Get all challenges
 * GET /api/admin/challenges
 */
const getChallenges = asyncHandler(async (req, res) => {
  const { page = 1, limit = 50, status, phase } = req.query;

  const query = {};
  if (status) query.status = status;
  if (phase) query.phase = phase;

  const challenges = await Challenge.find(query)
    .populate('userId', 'email firstName lastName')
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const count = await Challenge.countDocuments(query);

  res.json({
    success: true,
    data: {
      challenges,
      pagination: {
        total: count,
        page: parseInt(page),
        pages: Math.ceil(count / limit)
      }
    }
  });
});

/**
 * Get all payouts
 * GET /api/admin/payouts
 */
const getPayouts = asyncHandler(async (req, res) => {
  const { page = 1, limit = 50, status } = req.query;

  const query = {};
  if (status) query.status = status;

  const payouts = await Payout.find(query)
    .populate('userId', 'email firstName lastName')
    .populate('challengeId')
    .sort({ requestDate: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const count = await Payout.countDocuments(query);

  res.json({
    success: true,
    data: {
      payouts,
      pagination: {
        total: count,
        page: parseInt(page),
        pages: Math.ceil(count / limit)
      }
    }
  });
});

/**
 * Approve payout
 * POST /api/admin/payouts/:id/approve
 */
const approvePayout = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { approvedAmount } = req.body;

  const payout = await Payout.findById(id);
  if (!payout) {
    return res.status(404).json({ success: false, message: 'Payout not found' });
  }

  payout.status = 'approved';
  payout.approvedAmount = approvedAmount || payout.requestedAmount;
  payout.approvedBy = req.user.userId;
  payout.approvalDate = new Date();
  await payout.save();

  // Log audit
  await AuditLog.create({
    userId: req.user.userId,
    action: 'payout_approve',
    description: `Admin approved payout ${id}`,
    entityId: id
  });

  res.json({
    success: true,
    message: 'Payout approved successfully',
    data: payout
  });
});

/**
 * Get audit logs
 * GET /api/admin/audit-logs
 */
const getAuditLogs = asyncHandler(async (req, res) => {
  const { page = 1, limit = 50, action, userId } = req.query;

  const query = {};
  if (action) query.action = action;
  if (userId) query.userId = userId;

  const logs = await AuditLog.find(query)
    .populate('userId', 'email firstName lastName')
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const count = await AuditLog.countDocuments(query);

  res.json({
    success: true,
    data: {
      logs,
      pagination: {
        total: count,
        page: parseInt(page),
        pages: Math.ceil(count / limit)
      }
    }
  });
});

module.exports = {
  getStats,
  getUsers,
  updateUser,
  getChallenges,
  getPayouts,
  approvePayout,
  getAuditLogs
};
