/**
 * Auth Routes
 */

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verifyToken } = require('../middleware/auth.middleware');
const { validate, schemas } = require('../middleware/validation.middleware');
const { authLimiter } = require('../middleware/rateLimit.middleware');

// Public routes
router.post('/register', validate(schemas.register), authController.register);
router.post('/login', authLimiter, validate(schemas.login), authController.login);
router.post('/forgot-password', authLimiter, authController.forgotPassword);
router.post('/reset-password', validate(schemas.changePassword), authController.resetPassword);
router.get('/verify-email/:token', authController.verifyEmail);

// Protected routes
router.post('/refresh', authController.refreshToken);
router.post('/logout', verifyToken, authController.logout);
router.get('/me', verifyToken, authController.getCurrentUser);
router.put('/profile', verifyToken, validate(schemas.updateProfile), authController.updateProfile);
router.post('/change-password', verifyToken, validate(schemas.changePassword), authController.changePassword);

module.exports = router;
