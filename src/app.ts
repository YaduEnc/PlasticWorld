import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import 'express-async-errors';
import logger from './utils/logger';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';

const app: Application = express();

// Trust proxy (for rate limiting behind reverse proxy)
app.set('trust proxy', 1);

// Security middleware
app.use(helmet());

// CORS configuration
const corsOptions = {
  origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000'],
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Compression middleware
app.use(compression());

// HTTP request logging
if (process.env.NODE_ENV !== 'test') {
  app.use(
    morgan('combined', {
      stream: logger.stream as any,
      skip: (req: Request) => req.path === '/health',
    })
  );
}

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10), // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10), // 100 requests per window
  message: {
    success: false,
    error: {
      message: 'Too many requests from this IP, please try again later.',
      code: 'RATE_LIMIT_EXCEEDED',
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api', limiter);

// Health check endpoint (before rate limiting)
app.get('/health', async (_req: Request, res: Response) => {
  try {
    // Import here to avoid circular dependencies
    const database = (await import('./config/database')).default;
    const redisClient = (await import('./config/redis')).default;

    const [dbHealth, redisHealth] = await Promise.all([
      database.healthCheck(),
      redisClient.healthCheck(),
    ]);

    const health = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      services: {
        database: dbHealth,
        redis: redisHealth,
      },
    };

    const isHealthy = dbHealth.status === 'connected' && redisHealth.status === 'connected';

    res.status(isHealthy ? 200 : 503).json(health);
  } catch (error) {
    logger.error('Health check failed', { error });
    res.status(503).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      error: 'Health check failed',
    });
  }
});

// API routes will be added here in future phases
const apiVersion = process.env.API_VERSION || 'v1';
app.get(`/api/${apiVersion}`, (_req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'PlasticWorld API',
    version: apiVersion,
    timestamp: new Date().toISOString(),
  });
});

// 404 handler
app.use(notFoundHandler);

// Error handler (must be last)
app.use(errorHandler);

export default app;
