/**
 * Server Entry Point
 * Trivaro Prop Firm Backend
 */

require('dotenv').config();

const http = require('http');
const logger = require('./utils/logger');
const connectDB = require('./config/database');
const createApp = require('./app');
const { initializeSocket } = require('./websocket/socketServer');
const jobScheduler = require('./jobs/scheduler');

// Initialize database
connectDB();

// Create Express app
const app = createApp();

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.io
initializeSocket(server);

// Start scheduled jobs
jobScheduler.start();

// Start server
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  logger.info(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   🚀 Trivaro Prop Firm Backend Server                     ║
║                                                           ║
║   Server running on port ${PORT}                            ║
║   Environment: ${process.env.NODE_ENV || 'development'}                             ║
║   API: http://localhost:${PORT}/api                         ║
║   Health: http://localhost:${PORT}/health                   ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
  `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully...');
  server.close(() => {
    logger.info('Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully...');
  server.close(() => {
    logger.info('Server closed');
    process.exit(0);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

module.exports = server;
