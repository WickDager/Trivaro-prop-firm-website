/**
 * WebSocket Server Setup
 * Socket.io configuration for real-time updates
 */

const logger = require('../utils/logger');

let io = null;

/**
 * Initialize Socket.io server
 * @param {Object} server - HTTP server
 */
const initializeSocket = (server) => {
  const ioModule = require('socket.io');
  
  io = ioModule(server, {
    cors: {
      origin: process.env.WS_CORS_ORIGIN || process.env.FRONTEND_URL || 'http://localhost:3000',
      methods: ['GET', 'POST'],
      credentials: true
    },
    transports: ['websocket', 'polling']
  });

  // Authentication middleware
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    
    if (!token) {
      return next(new Error('Authentication required'));
    }

    // Verify token (simplified - in production, use JWT verification)
    socket.userId = token; // Store user ID
    next();
  });

  // Connection handler
  io.on('connection', (socket) => {
    logger.info(`WebSocket client connected: ${socket.id}`);

    // Join user's personal room
    socket.on('join-user-room', (userId) => {
      socket.join(`user:${userId}`);
      logger.info(`User ${userId} joined room`);
    });

    // Join challenge room
    socket.on('join-challenge-room', (challengeId) => {
      socket.join(`challenge:${challengeId}`);
      logger.info(`Joined challenge room: ${challengeId}`);
    });

    // Disconnect handler
    socket.on('disconnect', () => {
      logger.info(`WebSocket client disconnected: ${socket.id}`);
    });

    // Error handler
    socket.on('error', (error) => {
      logger.error(`WebSocket error: ${socket.id}`, error);
    });
  });

  return io;
};

/**
 * Get Socket.io instance
 */
const getIO = () => {
  if (!io) {
    throw new Error('Socket.io not initialized');
  }
  return io;
};

/**
 * Emit event to user room
 * @param {String} userId - User ID
 * @param {String} event - Event name
 * @param {Object} data - Event data
 */
const emitToUser = (userId, event, data) => {
  if (io) {
    io.to(`user:${userId}`).emit(event, data);
  }
};

/**
 * Emit event to challenge room
 * @param {String} challengeId - Challenge ID
 * @param {String} event - Event name
 * @param {Object} data - Event data
 */
const emitToChallenge = (challengeId, event, data) => {
  if (io) {
    io.to(`challenge:${challengeId}`).emit(event, data);
  }
};

/**
 * Broadcast event to all connected clients
 * @param {String} event - Event name
 * @param {Object} data - Event data
 */
const broadcast = (event, data) => {
  if (io) {
    io.emit(event, data);
  }
};

module.exports = {
  initializeSocket,
  getIO,
  emitToUser,
  emitToChallenge,
  broadcast
};
