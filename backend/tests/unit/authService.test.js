/**
 * Unit Tests for Auth Service
 * Tests authentication logic
 */

const authService = require('../src/services/authService');
const User = require('../src/models/User');

describe('Auth Service - Unit Tests', () => {
  describe('register', () => {
    test('should register new user successfully', async () => {
      const userData = {
        email: `test${Date.now()}@example.com`,
        password: 'Test123!',
        firstName: 'Test',
        lastName: 'User'
      };

      const result = await authService.register(userData);

      expect(result).toBeDefined();
      expect(result.user).toBeDefined();
      expect(result.user.email).toBe(userData.email);
      expect(result.user.firstName).toBe(userData.firstName);
      expect(result.tokens).toBeDefined();
      expect(result.tokens.accessToken).toBeDefined();
      expect(result.tokens.refreshToken).toBeDefined();
    });

    test('should fail when email already exists', async () => {
      const userData = {
        email: `duplicate${Date.now()}@example.com`,
        password: 'Test123!',
        firstName: 'Test',
        lastName: 'User'
      };

      // Register first user
      await authService.register(userData);

      // Try to register with same email
      await expect(authService.register(userData)).rejects.toThrow('Email already registered');
    });

    test('should hash password before storing', async () => {
      const userData = {
        email: `hashcheck${Date.now()}@example.com`,
        password: 'Test123!',
        firstName: 'Test',
        lastName: 'User'
      };

      await authService.register(userData);

      const user = await User.findOne({ email: userData.email }).select('+passwordHash');
      expect(user.passwordHash).not.toBe(userData.password);
      expect(user.passwordHash).toHaveLength(60); // bcrypt hash length
    });

    test('should generate email verification token', async () => {
      const userData = {
        email: `verify${Date.now()}@example.com`,
        password: 'Test123!',
        firstName: 'Test',
        lastName: 'User'
      };

      const result = await authService.register(userData);
      const user = await User.findById(result.user.id);

      expect(user.emailVerificationToken).toBeDefined();
      expect(user.emailVerificationToken).toHaveLength(64);
    });
  });

  describe('login', () => {
    test('should login with valid credentials', async () => {
      const userData = {
        email: `login${Date.now()}@example.com`,
        password: 'Test123!',
        firstName: 'Test',
        lastName: 'User'
      };

      await authService.register(userData);
      const result = await authService.login(userData.email, userData.password);

      expect(result).toBeDefined();
      expect(result.user.email).toBe(userData.email);
      expect(result.tokens.accessToken).toBeDefined();
      expect(result.tokens.refreshToken).toBeDefined();
    });

    test('should fail with invalid email', async () => {
      await expect(
        authService.login('nonexistent@example.com', 'Test123!')
      ).rejects.toThrow('Invalid email or password');
    });

    test('should fail with invalid password', async () => {
      const userData = {
        email: `wrongpass${Date.now()}@example.com`,
        password: 'Test123!',
        firstName: 'Test',
        lastName: 'User'
      };

      await authService.register(userData);

      await expect(
        authService.login(userData.email, 'WrongPassword!')
      ).rejects.toThrow('Invalid email or password');
    });

    test('should fail for inactive user', async () => {
      const userData = {
        email: `inactive${Date.now()}@example.com`,
        password: 'Test123!',
        firstName: 'Test',
        lastName: 'User'
      };

      await authService.register(userData);
      const user = await User.findOne({ email: userData.email });
      user.isActive = false;
      await user.save();

      await expect(
        authService.login(userData.email, userData.password)
      ).rejects.toThrow('Account is deactivated');
    });
  });

  describe('refreshToken', () => {
    test('should generate new tokens with valid refresh token', async () => {
      const userData = {
        email: `refresh${Date.now()}@example.com`,
        password: 'Test123!',
        firstName: 'Test',
        lastName: 'User'
      };

      const registerResult = await authService.register(userData);
      const newTokens = await authService.refreshToken(registerResult.tokens.refreshToken);

      expect(newTokens).toBeDefined();
      expect(newTokens.accessToken).toBeDefined();
      expect(newTokens.refreshToken).toBeDefined();
    });

    test('should fail with invalid refresh token', async () => {
      await expect(
        authService.refreshToken('invalid-token')
      ).rejects.toThrow('Invalid refresh token');
    });
  });

  describe('verifyEmail', () => {
    test('should verify email with valid token', async () => {
      const userData = {
        email: `emailverify${Date.now()}@example.com`,
        password: 'Test123!',
        firstName: 'Test',
        lastName: 'User'
      };

      const registerResult = await authService.register(userData);
      const user = await User.findById(registerResult.user.id);

      await authService.verifyEmail(user.emailVerificationToken);

      const updatedUser = await User.findById(user.id);
      expect(updatedUser.isEmailVerified).toBe(true);
      expect(updatedUser.emailVerificationToken).toBeUndefined();
    });

    test('should fail with invalid verification token', async () => {
      await expect(
        authService.verifyEmail('invalid-token')
      ).rejects.toThrow('Invalid verification token');
    });
  });
});
