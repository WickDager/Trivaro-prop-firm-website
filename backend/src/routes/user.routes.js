/**
 * User Routes
 */

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyToken } = require('../middleware/auth.middleware');

// All routes require authentication
router.use(verifyToken);

router.get('/me', userController.getProfile);
router.put('/me', userController.updateProfile);
router.get('/me/challenges', userController.getUserChallenges);
router.get('/me/dashboard', userController.getDashboard);

module.exports = router;
