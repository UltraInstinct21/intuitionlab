import rateLimit from 'express-rate-limit';
import { config } from '../config/env.js';

// General API rate limiter
export const apiLimiter = rateLimit({
  windowMs: config.rateLimits.generalWindowMs,
  max: config.rateLimits.generalMax,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Too many requests from this IP. Please try again after 15 minutes.',
    timestamp: new Date().toISOString(),
  },
});

// Notes write/update rate limiter (prevents note spamming)
export const notesWriteLimiter = rateLimit({
  windowMs: config.rateLimits.notesWriteWindowMs,
  max: config.rateLimits.notesWriteMax,
  standardHeaders: true,
  legacyHeaders: false,
  validate: { keyGeneratorIpFallback: false },
  keyGenerator: (req) => req.user?.id || req.ip || 'anonymous',
  message: {
    success: false,
    error: 'Too many note updates. Note saving is limited to 30 requests per minute.',
    timestamp: new Date().toISOString(),
  },
});

// Admin panel rate limiter
export const adminLimiter = rateLimit({
  windowMs: config.rateLimits.adminWindowMs,
  max: config.rateLimits.adminMax,
  standardHeaders: true,
  legacyHeaders: false,
  validate: { keyGeneratorIpFallback: false },
  keyGenerator: (req) => req.user?.id || req.ip || 'anonymous-admin',
  message: {
    success: false,
    error: 'Too many admin operations. Limited to 60 requests per minute.',
    timestamp: new Date().toISOString(),
  },
});
