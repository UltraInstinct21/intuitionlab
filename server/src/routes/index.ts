import { Router } from 'express';
import notesRoutes from './notes.routes.js';
import userRoutes from './user.routes.js';
import adminRoutes from './admin.routes.js';
import authRoutes from './auth.routes.js';
import { getHealth } from '../controllers/health.controller.js';

const router = Router();

// Health check endpoint
router.get('/health', getHealth);

// API Resources
router.use('/auth', authRoutes);
router.use('/notes', notesRoutes);
router.use('/user', userRoutes);
router.use('/admin', adminRoutes);

export default router;
