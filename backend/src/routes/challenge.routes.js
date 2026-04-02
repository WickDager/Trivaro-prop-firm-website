/**
 * Challenge Routes
 */

const express = require('express');
const router = express.Router();
const challengeController = require('../controllers/challengeController');
const { verifyToken } = require('../middleware/auth.middleware');
const { validate, schemas } = require('../middleware/validation.middleware');

// All routes require authentication
router.use(verifyToken);

router.post('/purchase', validate(schemas.purchaseChallenge), challengeController.purchaseChallenge);
router.get('/', challengeController.getUserChallenges);
router.get('/:id', challengeController.getChallengeDetails);
router.get('/:id/trades', challengeController.getChallengeTrades);
router.get('/:id/statistics', challengeController.getChallengeStatistics);
router.get('/:id/equity-history', challengeController.getEquityHistory);
router.post('/:id/sync', challengeController.syncTrades);
router.post('/:id/check-rules', challengeController.checkRules);
router.post('/:id/advance-phase', challengeController.advancePhase);
router.delete('/:id', challengeController.deleteChallenge);

module.exports = router;
