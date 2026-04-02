/**
 * Unit Tests for Encryption Service
 * Tests data encryption/decryption
 */

const encryptionService = require('../src/services/encryptionService');

describe('Encryption Service - Unit Tests', () => {
  const testPassword = 'MySecurePassword123!';
  const testData = 'Sensitive trading account credentials';

  describe('encrypt', () => {
    test('should encrypt plain text successfully', () => {
      const encrypted = encryptionService.encrypt(testPassword);
      
      expect(encrypted).toBeDefined();
      expect(encrypted).toContain(':');
      expect(encrypted).not.toBe(testPassword);
    });

    test('should produce different encrypted output for same input', () => {
      const encrypted1 = encryptionService.encrypt(testPassword);
      const encrypted2 = encryptionService.encrypt(testPassword);
      
      expect(encrypted1).not.toBe(encrypted2);
    });

    test('should handle special characters', () => {
      const specialText = 'P@$$w0rd!#$%^&*()_+-=[]{}|;:,.<>?';
      const encrypted = encryptionService.encrypt(specialText);
      
      expect(encrypted).toBeDefined();
      expect(encrypted).toContain(':');
    });
  });

  describe('decrypt', () => {
    test('should decrypt encrypted text to original', () => {
      const encrypted = encryptionService.encrypt(testPassword);
      const decrypted = encryptionService.decrypt(encrypted);
      
      expect(decrypted).toBe(testPassword);
    });

    test('should decrypt correctly after multiple encrypt/decrypt cycles', () => {
      for (let i = 0; i < 5; i++) {
        const encrypted = encryptionService.encrypt(testData);
        const decrypted = encryptionService.decrypt(encrypted);
        expect(decrypted).toBe(testData);
      }
    });

    test('should throw error for invalid encrypted format', () => {
      expect(() => {
        encryptionService.decrypt('invalid-format');
      }).toThrow();
    });

    test('should throw error for empty string', () => {
      expect(() => {
        encryptionService.decrypt('');
      }).toThrow();
    });
  });

  describe('hash', () => {
    test('should create SHA-256 hash', () => {
      const hash = encryptionService.hash(testPassword);
      
      expect(hash).toBeDefined();
      expect(hash).toHaveLength(64); // SHA-256 produces 64 hex characters
    });

    test('should produce same hash for same input', () => {
      const hash1 = encryptionService.hash(testPassword);
      const hash2 = encryptionService.hash(testPassword);
      
      expect(hash1).toBe(hash2);
    });

    test('should produce different hash for different input', () => {
      const hash1 = encryptionService.hash('password1');
      const hash2 = encryptionService.hash('password2');
      
      expect(hash1).not.toBe(hash2);
    });
  });

  describe('generateToken', () => {
    test('should generate random token of specified length', () => {
      const token = encryptionService.generateToken(32);
      
      expect(token).toBeDefined();
      expect(token).toHaveLength(64); // 32 bytes = 64 hex characters
    });

    test('should generate unique tokens', () => {
      const tokens = new Set();
      for (let i = 0; i < 100; i++) {
        tokens.add(encryptionService.generateToken());
      }
      
      expect(tokens.size).toBe(100);
    });
  });

  describe('generatePassword', () => {
    test('should generate password of specified length', () => {
      const password = encryptionService.generatePassword(16);
      
      expect(password).toBeDefined();
      expect(password).toHaveLength(16);
    });

    test('should include mixed characters', () => {
      const password = encryptionService.generatePassword(20);
      
      expect(/[a-z]/.test(password)).toBe(true);
      expect(/[A-Z]/.test(password)).toBe(true);
      expect(/[0-9]/.test(password)).toBe(true);
    });
  });
});
