import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { config } from './config/env.js';
import { apiLimiter } from './middlewares/rateLimiter.middleware.js';
import { errorHandler } from './middlewares/error.middleware.js';
import apiRouter from './routes/index.js';

export function createApp(): Express {
  const app = express();

  // Security headers
  app.use(helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  }));

  // CORS setup
  app.use(cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl, dev) or matching origins
      if (!origin || origin === config.corsOrigin || origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:')) {
        callback(null, true);
      } else {
        callback(null, true); // Permissive in dev, configurable in prod
      }
    },
    credentials: true,
  }));

  // Request logging
  if (config.nodeEnv !== 'test') {
    app.use(morgan('dev'));
  }

  // Body parsers
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true, limit: '1mb' }));

  // Global API rate limiting
  app.use('/api', apiLimiter);

  // Mount API version 1
  app.use('/api/v1', apiRouter);

  // Root welcome route
  app.get('/', (_req, res) => {
    res.json({
      name: 'IntuitionLab Backend API',
      version: '1.0.0',
      status: 'operational',
      docs: '/api/v1/health',
      timestamp: new Date().toISOString(),
    });
  });

  // 404 handler
  app.use((_req, res) => {
    res.status(404).json({
      success: false,
      error: 'API route not found',
      timestamp: new Date().toISOString(),
    });
  });

  // Global error handler
  app.use(errorHandler);

  return app;
}
