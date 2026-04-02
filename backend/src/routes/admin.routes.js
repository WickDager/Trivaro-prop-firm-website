/**
 * Admin Routes
 */

const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { verifyToken, checkRole } = require('../middleware/auth.middleware');

// All routes require admin role
router.use(verifyToken);
router.use(checkRole('admin'));

router.get('/stats', adminController.getStats);
router.get('/users', adminController.getUsers);
router.put('/users/:id', adminController.updateUser);
router.get('/challenges', adminController.getChallenges);
router.get('/payouts', adminController.getPayouts);
router.post('/payouts/:id/approve', adminController.approvePayout);
router.get('/audit-logs', adminController.getAuditLogs);

module.exports = router;
