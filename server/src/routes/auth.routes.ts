import { Router } from 'express';
import { googleAuthStart, googleAuthCallback, getAuthStatus, getAuthMe } from '../controllers/auth.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = Router();

// Public: capability probe + OAuth flow
router.get('/status', getAuthStatus);
router.get('/google', googleAuthStart);
router.get('/google/callback', googleAuthCallback);

// Authenticated: validate app/Supabase token, return req.user
router.get('/me', authMiddleware, getAuthMe);

export default router;
