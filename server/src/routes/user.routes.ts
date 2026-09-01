import { Router } from 'express';
import { getMe, updateMe, syncProgress } from '../controllers/user.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = Router();

// User routes require authentication
router.use(authMiddleware);

// GET /api/v1/user/me - Get current user profile and progress
router.get('/me', getMe);

// PUT /api/v1/user/me - Update user profile
router.put('/me', updateMe);

// POST /api/v1/user/sync-progress - Sync solved & bookmarked problems
router.post('/sync-progress', syncProgress);

export default router;
