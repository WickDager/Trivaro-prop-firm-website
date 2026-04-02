/**
 * Broker Configuration
 * Doprime/MetaAPI integration setup
 */

const MetaApi = require('metaapi.cloud-sdk').default;
const logger = require('../utils/logger');

class BrokerService {
  constructor() {
    this.api = null;
    this.provisioningProfile = null;
    this.activeConnections = new Map();
    this.initialized = false;
  }

  /**
   * Initialize MetaAPI connection
   */
  async initialize() {
    if (this.initialized) {
      return;
    }

    try {
      const token = process.env.META_API_TOKEN;
      
      if (!token || token === 'your-metaapi-token-here') {
        logger.warn('MetaAPI token not configured. Broker services will be unavailable.');
        return;
      }

      this.api = new MetaApi(token);
      
      // Initialize provisioning profile
      await this.initializeProvisioningProfile();
      
      this.initialized = true;
      logger.info('MetaAPI broker service initialized');
    } catch (error) {
      logger.error('Failed to initialize MetaAPI:', error);
      throw error;
    }
  }

  /**
   * Initialize provisioning profile for Doprime
   */
  async initializeProvisioningProfile() {
    try {
      const profiles = await this.api.provisioningProfileApi.getProvisioningProfiles();
      this.provisioningProfile = profiles.find(p => p.name === 'Doprime-Profile');

      if (!this.provisioningProfile) {
        this.provisioningProfile = await this.api.provisioningProfileApi.createProvisioningProfile({
          name: 'Doprime-Profile',
          version: 5, // MT5
          broker: 'Doprime',
          serverName: process.env.DOPRIME_SERVER_NAME || 'Doprime-Server'
        });
      }

      logger.info('Provisioning profile initialized');
    } catch (error) {
      logger.error('Failed to initialize provisioning profile:', error);
      throw error;
    }
  }

  /**
   * Create demo account for a challenge
   * @param {String} userId - User ID
   * @param {Number} accountSize - Account balance
   * @param {String} accountType - 'balance-based' or 'equity-based'
   * @param {Number} phase - Challenge phase (1 or 2)
   * @returns {Object} Account credentials
   */
  async createDemoAccount(userId, accountSize, accountType, phase) {
    try {
      if (!this.initialized) {
        await this.initialize();
      }

      if (!this.provisioningProfile) {
        throw new Error('Provisioning profile not initialized');
      }

      // In development mode, return mock credentials
      if (process.env.NODE_ENV === 'development' && !process.env.META_API_TOKEN) {
        logger.warn('Development mode: Using mock credentials');
        return {
          login: `DEMO${Date.now()}`,
          password: 'demo-password-' + Math.random().toString(36).slice(-8),
          server: process.env.DOPRIME_SERVER_NAME || 'Doprime-Demo',
          platform: 'MT5'
        };
      }

      // Create demo account via MetaAPI
      const demoAccount = await this.provisioningProfile.createMt5DemoAccount({
        accountType: 'demo',
        balance: accountSize,
        leverage: 100, // 1:100 leverage
        serverName: process.env.DOPRIME_SERVER_NAME,
        name: userId
      });

      logger.info(`Demo account created for user ${userId}: ${demoAccount.login}`);

      return {
        login: demoAccount.login,
        password: demoAccount.password,
        server: demoAccount.server,
        platform: 'MT5'
      };
    } catch (error) {
      logger.error('Failed to create demo account:', error);
      throw new Error(`Account creation failed: ${error.message}`);
    }
  }

  /**
   * Delete demo account
   * @param {String} mt5Login - MT5 login ID
   */
  async deleteDemoAccount(mt5Login) {
    try {
      // Close connection if active
      if (this.activeConnections.has(mt5Login)) {
        const connection = this.activeConnections.get(mt5Login);
        await connection.close();
        this.activeConnections.delete(mt5Login);
      }

      if (!this.initialized) {
        logger.warn('Broker not initialized, skipping account deletion');
        return;
      }

      // Delete account via API
      const accounts = await this.api.metatraderAccountApi.getAccounts();
      const account = accounts.find(acc => acc.login === mt5Login);

      if (account) {
        await account.remove();
        logger.info(`Deleted demo account: ${mt5Login}`);
      }
    } catch (error) {
      logger.error(`Failed to delete account ${mt5Login}:`, error);
    }
  }

  /**
   * Connect to trading account and start syncing
   * @param {String} challengeId - Challenge ID
   * @param {String} mt5Login - MT5 login
   * @param {String} mt5Password - MT5 password
   * @param {String} mt5Server - MT5 server
   * @returns {Object} Connection object
   */
  async connectToAccount(challengeId, mt5Login, mt5Password, mt5Server) {
    try {
      if (!this.initialized) {
        await this.initialize();
      }

      // Check if already connected
      if (this.activeConnections.has(mt5Login)) {
        return this.activeConnections.get(mt5Login);
      }

      if (process.env.NODE_ENV === 'development' && !process.env.META_API_TOKEN) {
        logger.warn('Development mode: Mock connection');
        const mockConnection = {
          challengeId,
          connected: true,
          getAccountInformation: async () => ({
            balance: 100000,
            equity: 100000,
            margin: 0,
            freeMargin: 100000,
            marginLevel: 0,
            credit: 0
          }),
          getPositions: async () => [],
          close: async () => {}
        };
        this.activeConnections.set(mt5Login, mockConnection);
        return mockConnection;
      }

      // Get MetaAPI account
      const accounts = await this.api.metatraderAccountApi.getAccounts();
      let account = accounts.find(acc => acc.login === mt5Login);

      if (!account) {
        // Create MetaAPI account reference
        account = await this.api.metatraderAccountApi.createAccount({
          login: mt5Login,
          password: mt5Password,
          server: mt5Server,
          platform: 'mt5',
          name: `Challenge-${challengeId}`,
          type: 'cloud'
        });
      }

      // Deploy and connect
      await account.deploy();
      await account.waitDeployed();

      const connection = account.getRPCConnection();
      await connection.connect();
      await connection.waitSynchronized();

      this.activeConnections.set(mt5Login, connection);
      logger.info(`Connected to account ${mt5Login}`);

      return connection;
    } catch (error) {
      logger.error(`Failed to connect to account:`, error);
      throw error;
    }
  }

  /**
   * Get current account information
   * @param {String} challengeId - Challenge ID
   * @param {String} mt5Login - MT5 login
   * @param {String} mt5Password - MT5 password
   * @param {String} mt5Server - MT5 server
   * @returns {Object} Account info with balance, equity, etc.
   */
  async getAccountInfo(challengeId, mt5Login, mt5Password, mt5Server) {
    try {
      const connection = await this.connectToAccount(challengeId, mt5Login, mt5Password, mt5Server);
      const accountInfo = await connection.getAccountInformation();
      const positions = await connection.getPositions();

      // Calculate floating P/L
      let floatingPL = 0;
      positions.forEach(pos => {
        floatingPL += pos.profit || 0;
      });

      return {
        balance: accountInfo.balance,
        equity: accountInfo.equity,
        margin: accountInfo.margin,
        freeMargin: accountInfo.freeMargin,
        marginLevel: accountInfo.marginLevel,
        floatingPL: floatingPL,
        positions: positions.length,
        credit: accountInfo.credit || 0
      };
    } catch (error) {
      logger.error(`Failed to get account info:`, error);
      // Return mock data in development
      if (process.env.NODE_ENV === 'development') {
        return {
          balance: 100000,
          equity: 100000,
          margin: 0,
          freeMargin: 100000,
          marginLevel: 0,
          floatingPL: 0,
          positions: 0,
          credit: 0
        };
      }
      throw error;
    }
  }

  /**
   * Get real-time positions
   * @param {String} challengeId - Challenge ID
   * @param {String} mt5Login - MT5 login
   * @param {String} mt5Password - MT5 password
   * @param {String} mt5Server - MT5 server
   * @returns {Array} Open positions
   */
  async getOpenPositions(challengeId, mt5Login, mt5Password, mt5Server) {
    try {
      const connection = await this.connectToAccount(challengeId, mt5Login, mt5Password, mt5Server);
      const positions = await connection.getPositions();
      return positions;
    } catch (error) {
      logger.error(`Failed to get positions:`, error);
      return [];
    }
  }

  /**
   * Close all connections for maintenance
   */
  async closeAllConnections() {
    try {
      for (const [login, connection] of this.activeConnections.entries()) {
        await connection.close();
        logger.info(`Closed connection for ${login}`);
      }
      this.activeConnections.clear();
    } catch (error) {
      logger.error('Failed to close connections:', error);
    }
  }

  /**
   * Get instance
   */
  static getInstance() {
    if (!BrokerService.instance) {
      BrokerService.instance = new BrokerService();
    }
    return BrokerService.instance;
  }
}

module.exports = BrokerService.getInstance();
