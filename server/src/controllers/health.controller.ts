import { Request, Response } from 'express';
import { isSupabaseReady } from '../config/supabase.js';

export const getHealth = (_req: Request, res: Response): void => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    supabaseConnected: isSupabaseReady(),
  });
};
