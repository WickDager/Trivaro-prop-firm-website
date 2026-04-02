/**
 * Encryption Service
 * AES-256 encryption/decryption for sensitive data
 */

const crypto = require('crypto');
const logger = require('../utils/logger');

const ALGORITHM = 'aes-256-cbc';
const IV_LENGTH = 16;

// Get encryption key from environment (must be 32 bytes in hex)
const getKey = () => {
  const key = process.env.ENCRYPTION_KEY;
  if (!key || key.length !== 64) {
    logger.warn('Invalid or missing ENCRYPTION_KEY. Using default key (NOT SECURE FOR PRODUCTION)');
    return crypto.randomBytes(32);
  }
  return Buffer.from(key, 'hex');
};

/**
 * Encrypt text
 * @param {String} text - Plain text to encrypt
 * @returns {String} Encrypted text (IV:encrypted)
 */
const encrypt = (text) => {
  try {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv(ALGORITHM, getKey(), iv);
    
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    // Return IV:encrypted format
    return iv.toString('hex') + ':' + encrypted;
  } catch (error) {
    logger.error('Encryption failed:', error);
    throw new Error('Failed to encrypt data');
  }
};

/**
 * Decrypt text
 * @param {String} text - Encrypted text (IV:encrypted)
 * @returns {String} Decrypted plain text
 */
const decrypt = (text) => {
  try {
    const parts = text.split(':');
    if (parts.length !== 2) {
      throw new Error('Invalid encrypted format');
    }
    
    const iv = Buffer.from(parts.shift(), 'hex');
    const encrypted = parts.join(':');
    
    const decipher = crypto.createDecipheriv(ALGORITHM, getKey(), iv);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  } catch (error) {
    logger.error('Decryption failed:', error);
    throw new Error('Failed to decrypt data');
  }
};

/**
 * Hash data (one-way encryption)
 * @param {String} data - Data to hash
 * @returns {String} SHA-256 hash
 */
const hash = (data) => {
  return crypto.createHash('sha256').update(data).digest('hex');
};

/**
 * Generate random token
 * @param {Number} length - Token length in bytes
 * @returns {String} Random hex token
 */
const generateToken = (length = 32) => {
  return crypto.randomBytes(length).toString('hex');
};

/**
 * Generate secure password
 * @param {Number} length - Password length
 * @returns {String} Random password
 */
const generatePassword = (length = 12) => {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
  let password = '';
  const randomBytes = crypto.randomBytes(length);
  
  for (let i = 0; i < length; i++) {
    password += charset[randomBytes[i] % charset.length];
  }
  
  return password;
};

module.exports = {
  encrypt,
  decrypt,
  hash,
  generateToken,
  generatePassword
};
