/**
 * Validation Middleware
 * Request validation using Joi
 */

const Joi = require('joi');
const logger = require('../utils/logger');

/**
 * Validate request against schema
 * @param {Object} schema - Joi schema
 */
const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));

      logger.warn('Validation error:', errors);

      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Validation failed',
          details: errors
        }
      });
    }

    next();
  };
};

/**
 * Registration schema
 */
const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  firstName: Joi.string().min(2).max(50).required(),
  lastName: Joi.string().min(2).max(50).required(),
  phone: Joi.string().optional(),
  country: Joi.string().optional()
});

/**
 * Login schema
 */
const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

/**
 * Challenge purchase schema
 */
const purchaseChallengeSchema = Joi.object({
  accountSize: Joi.number().valid(5000, 10000, 25000, 50000, 100000).required(),
  accountType: Joi.string().valid('balance-based', 'equity-based').required(),
  paymentMethod: Joi.string().valid('stripe', 'paypal', 'crypto').default('stripe')
});

/**
 * Payment schema
 */
const paymentSchema = Joi.object({
  challengeId: Joi.string().required(),
  paymentMethod: Joi.string().valid('stripe', 'paypal').required(),
  paymentDetails: Joi.object().required()
});

/**
 * Profile update schema
 */
const updateProfileSchema = Joi.object({
  firstName: Joi.string().min(2).max(50).optional(),
  lastName: Joi.string().min(2).max(50).optional(),
  phone: Joi.string().optional(),
  country: Joi.string().optional()
});

/**
 * Password change schema
 */
const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required(),
  newPassword: Joi.string().min(6).required()
});

/**
 * Payout request schema
 */
const payoutRequestSchema = Joi.object({
  challengeId: Joi.string().required(),
  amount: Joi.number().positive().required(),
  paymentMethod: Joi.string().valid('bank_transfer', 'crypto', 'paypal').required(),
  paymentDetails: Joi.object().required()
});

module.exports = {
  validate,
  schemas: {
    register: registerSchema,
    login: loginSchema,
    purchaseChallenge: purchaseChallengeSchema,
    payment: paymentSchema,
    updateProfile: updateProfileSchema,
    changePassword: changePasswordSchema,
    payoutRequest: payoutRequestSchema
  }
};
