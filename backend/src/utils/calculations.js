/**
 * Trading Calculations Utility
 */

/**
 * Calculate profit percentage
 * @param {Number} initial - Initial balance
 * @param {Number} current - Current balance
 * @returns {Number} Profit percentage
 */
const calculateProfitPercentage = (initial, current) => {
  return ((current - initial) / initial) * 100;
};

/**
 * Calculate drawdown percentage
 * @param {Number} initial - Initial balance
 * @param {Number} current - Current balance
 * @returns {Number} Drawdown percentage
 */
const calculateDrawdownPercentage = (initial, current) => {
  return ((initial - current) / initial) * 100;
};

/**
 * Calculate trailing drawdown
 * @param {Number} highestEquity - Highest equity reached
 * @param {Number} currentEquity - Current equity
 * @returns {Number} Drawdown from highest
 */
const calculateTrailingDrawdown = (highestEquity, currentEquity) => {
  return ((highestEquity - currentEquity) / highestEquity) * 100;
};

/**
 * Calculate position size based on risk
 * @param {Number} accountBalance - Account balance
 * @param {Number} riskPercent - Risk percentage (e.g., 1 for 1%)
 * @param {Number} stopLossPips - Stop loss in pips
 * @param {Number} pipValue - Pip value per lot
 * @returns {Number} Lot size
 */
const calculatePositionSize = (accountBalance, riskPercent, stopLossPips, pipValue) => {
  const riskAmount = accountBalance * (riskPercent / 100);
  return riskAmount / (stopLossPips * pipValue);
};

/**
 * Calculate pip value
 * @param {String} symbol - Trading symbol
 * @param {Number} volume - Volume in lots
 * @returns {Number} Pip value
 */
const calculatePipValue = (symbol, volume) => {
  // Simplified calculation
  const standardPipValue = 10; // For EURUSD
  return standardPipValue * volume;
};

/**
 * Calculate win rate
 * @param {Number} wins - Number of winning trades
 * @param {Number} total - Total number of trades
 * @returns {Number} Win rate percentage
 */
const calculateWinRate = (wins, total) => {
  if (total === 0) return 0;
  return (wins / total) * 100;
};

/**
 * Calculate profit factor
 * @param {Number} grossProfit - Total gross profit
 * @param {Number} grossLoss - Total gross loss
 * @returns {Number} Profit factor
 */
const calculateProfitFactor = (grossProfit, grossLoss) => {
  if (grossLoss === 0) return grossProfit > 0 ? grossProfit : 0;
  return grossProfit / grossLoss;
};

/**
 * Calculate risk-reward ratio
 * @param {Number} risk - Risk amount
 * @param {Number} reward - Reward amount
 * @returns {Number} Risk-reward ratio
 */
const calculateRiskRewardRatio = (risk, reward) => {
  if (risk === 0) return 0;
  return reward / risk;
};

/**
 * Calculate expected value
 * @param {Number} winRate - Win rate percentage
 * @param {Number} avgWin - Average win
 * @param {Number} avgLoss - Average loss
 * @returns {Number} Expected value
 */
const calculateExpectedValue = (winRate, avgWin, avgLoss) => {
  return (winRate / 100) * avgWin - ((100 - winRate) / 100) * avgLoss;
};

module.exports = {
  calculateProfitPercentage,
  calculateDrawdownPercentage,
  calculateTrailingDrawdown,
  calculatePositionSize,
  calculatePipValue,
  calculateWinRate,
  calculateProfitFactor,
  calculateRiskRewardRatio,
  calculateExpectedValue
};
