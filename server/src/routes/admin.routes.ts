import { Router } from 'express';
import { listUsers, changeUserRole, getAnalytics, getSettings, updateSettings } from '../controllers/admin.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { adminMiddleware } from '../middlewares/admin.middleware.js';
import { adminLimiter } from '../middlewares/rateLimiter.middleware.js';

const router = Router();

// All admin routes require Authentication + Admin Role Guard + Admin Rate Limiting
router.use(authMiddleware);
router.use(adminMiddleware);
router.use(adminLimiter);

// GET /api/v1/admin/users - List users with pagination and search
router.get('/users', listUsers);

// PATCH /api/v1/admin/users/:id/role - Change user role
router.patch('/users/:id/role', changeUserRole);

// GET /api/v1/admin/analytics - Get system metrics and engagement stats
router.get('/analytics', getAnalytics);

// GET /api/v1/admin/settings - Get current system settings
router.get('/settings', getSettings);

// PUT /api/v1/admin/settings - Update system settings (maintenance, banner, char limit)
router.put('/settings', updateSettings);

export default router;
