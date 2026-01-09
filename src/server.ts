import dotenv from 'dotenv';

// Load environment variables first
dotenv.config();

import app from './app';
import database from './config/database';
import redisClient from './config/redis';
import logger from './utils/logger';
import { initializeFirebase } from './config/firebase';

const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

/**
 * Graceful shutdown handler
 */
const gracefulShutdown = async (signal: string) => {
  logger.info(`${signal} received. Starting graceful shutdown...`);

  // Close server
  server.close(() => {
    logger.info('HTTP server closed');

    // Close database connections
    database
      .disconnect()
      .then(() => {
        logger.info('Database connections closed');
      })
      .catch((error) => {
        logger.error('Error closing database connections', { error });
      });

    // Close Redis connections
    redisClient
      .disconnect()
      .then(() => {
        logger.info('Redis connections closed');
        process.exit(0);
      })
      .catch((error) => {
        logger.error('Error closing Redis connections', { error });
        process.exit(1);
      });
  });

  // Force close after 10 seconds
  setTimeout(() => {
    logger.error('Forced shutdown after timeout');
    process.exit(1);
  }, 10000);
};

/**
 * Initialize server
 */
const startServer = async () => {
  try {
    // Initialize Firebase first (after dotenv has loaded)
    logger.info('Initializing Firebase Admin SDK...');
    initializeFirebase();

    // Connect to database
    logger.info('Connecting to PostgreSQL...');
    await database.connect();

    // Connect to Redis
    logger.info('Connecting to Redis...');
    await redisClient.connect();

    // Start HTTP server
    const server = app.listen(PORT, () => {
      logger.info(`🚀 Server running on port ${PORT}`, {
        environment: NODE_ENV,
        port: PORT,
        timestamp: new Date().toISOString(),
      });
    });

    // Handle server errors
    server.on('error', (error: NodeJS.ErrnoException) => {
      if (error.syscall !== 'listen') {
        throw error;
      }

      const bind = typeof PORT === 'string' ? `Pipe ${PORT}` : `Port ${PORT}`;

      switch (error.code) {
        case 'EACCES':
          logger.error(`${bind} requires elevated privileges`);
          process.exit(1);
          break;
        case 'EADDRINUSE':
          logger.error(`${bind} is already in use`);
          process.exit(1);
          break;
        default:
          throw error;
      }
    });

    // Graceful shutdown handlers
    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

    // Handle uncaught exceptions
    process.on('uncaughtException', (error: Error) => {
      logger.error('Uncaught Exception', {
        error: error.message,
        stack: error.stack,
      });
      gracefulShutdown('uncaughtException');
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (reason: any, _promise: Promise<any>) => {
      logger.error('Unhandled Rejection', {
        reason: reason?.message || reason,
        stack: reason?.stack,
      });
      gracefulShutdown('unhandledRejection');
    });

    return server;
  } catch (error) {
    logger.error('Failed to start server', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    });
    process.exit(1);
  }
};

// Start the server
let server: any;
startServer().then((s) => {
  server = s;
});

export default server;
