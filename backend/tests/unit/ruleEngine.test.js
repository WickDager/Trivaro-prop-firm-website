/**
 * Unit Tests for Rule Engine
 * Tests trading rule validation logic
 */

const ruleEngine = require('../src/services/ruleEngine');

describe('Rule Engine - Unit Tests', () => {
  describe('checkMaxDrawdown', () => {
    test('should pass when balance is above max drawdown limit (balance-based)', () => {
      const challenge = {
        accountType: 'balance-based',
        initialBalance: 100000,
        currentBalance: 95000
      };

      const accountInfo = {
        balance: 95000,
        equity: 95000
      };

      const result = ruleEngine.checkMaxDrawdown(challenge, accountInfo);
      expect(result.valid).toBe(true);
    });

    test('should fail when balance is below max drawdown limit (balance-based)', () => {
      const challenge = {
        accountType: 'balance-based',
        initialBalance: 100000,
        currentBalance: 89000
      };

      const accountInfo = {
        balance: 89000,
        equity: 89000
      };

      const result = ruleEngine.checkMaxDrawdown(challenge, accountInfo);
      expect(result.valid).toBe(false);
      expect(result.violation.rule).toBe('max_drawdown');
    });

    test('should pass when equity is above trailing drawdown limit (equity-based)', () => {
      const challenge = {
        accountType: 'equity-based',
        initialBalance: 100000,
        highestEquity: 110000,
        currentEquity: 100000
      };

      const accountInfo = {
        balance: 100000,
        equity: 100000
      };

      const result = ruleEngine.checkMaxDrawdown(challenge, accountInfo);
      expect(result.valid).toBe(true);
    });

    test('should fail when equity is below trailing drawdown limit (equity-based)', () => {
      const challenge = {
        accountType: 'equity-based',
        initialBalance: 100000,
        highestEquity: 110000,
        currentEquity: 98000
      };

      const accountInfo = {
        balance: 98000,
        equity: 98000
      };

      const result = ruleEngine.checkMaxDrawdown(challenge, accountInfo);
      expect(result.valid).toBe(false);
      expect(result.violation.type).toBe('equity-based');
    });
  });

  describe('checkDailyDrawdown', () => {
    test('should pass when balance is above daily limit (balance-based)', () => {
      const challenge = {
        accountType: 'balance-based',
        initialBalance: 100000,
        dailyStartEquity: 100000
      };

      const accountInfo = {
        balance: 96000,
        equity: 96000
      };

      const result = ruleEngine.checkDailyDrawdown(challenge, accountInfo);
      expect(result.valid).toBe(true);
    });

    test('should fail when balance is below daily limit (balance-based)', () => {
      const challenge = {
        accountType: 'balance-based',
        initialBalance: 100000
      };

      const accountInfo = {
        balance: 94000,
        equity: 94000
      };

      const result = ruleEngine.checkDailyDrawdown(challenge, accountInfo);
      expect(result.valid).toBe(false);
      expect(result.violation.rule).toBe('daily_drawdown');
    });

    test('should update highestEquity when current equity is higher (equity-based)', () => {
      const challenge = {
        accountType: 'equity-based',
        initialBalance: 100000,
        highestEquity: 100000,
        dailyStartEquity: 100000
      };

      const accountInfo = {
        balance: 105000,
        equity: 105000
      };

      ruleEngine.checkDailyDrawdown(challenge, accountInfo);
      expect(challenge.highestEquity).toBe(105000);
    });
  });

  describe('calculateProfitPercentage', () => {
    test('should calculate correct profit percentage', () => {
      const initial = 100000;
      const current = 110000;
      const expected = 10;

      const profit = challengeService.calculateProfitPercentage(initial, current);
      expect(profit).toBe(expected);
    });

    test('should calculate negative profit percentage for loss', () => {
      const initial = 100000;
      const current = 95000;
      const expected = -5;

      const profit = ((current - initial) / initial) * 100;
      expect(profit).toBe(expected);
    });
  });
});
