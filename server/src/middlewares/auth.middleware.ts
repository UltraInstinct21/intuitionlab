import { Request, Response, NextFunction } from 'express';
import { supabaseAdmin } from '../config/supabase.js';
import { AuthenticatedUser } from '../types/user.types.js';

// Extend Express Request
declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

export const authMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        error: 'Unauthorized: Missing or invalid Bearer token',
        timestamp: new Date().toISOString(),
      });
      return;
    }

    const token = authHeader.split(' ')[1];

    if (!supabaseAdmin) {
      // Mock / Local Dev fallback if Supabase is not configured yet
      req.user = {
        id: 'mock-user-id',
        email: 'dev@intuitionlab.local',
        role: 'admin',
        username: 'DevAdmin',
      };
      next();
      return;
    }

    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);

    if (authError || !user) {
      res.status(401).json({
        success: false,
        error: 'Unauthorized: Invalid or expired token',
        timestamp: new Date().toISOString(),
      });
      return;
    }

    // Fetch user profile from public.profiles to check role
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('id, email, username, role')
      .eq('id', user.id)
      .single();

    req.user = {
      id: user.id,
      email: user.email || profile?.email || '',
      role: (profile?.role === 'admin' ? 'admin' : 'user'),
      username: profile?.username,
    };

    next();
  } catch (error) {
    next(error);
  }
};

export const optionalAuthMiddleware = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      next();
      return;
    }

    const token = authHeader.split(' ')[1];
    if (supabaseAdmin) {
      const { data: { user } } = await supabaseAdmin.auth.getUser(token);
      if (user) {
        const { data: profile } = await supabaseAdmin
          .from('profiles')
          .select('id, email, username, role')
          .eq('id', user.id)
          .single();

        req.user = {
          id: user.id,
          email: user.email || profile?.email || '',
          role: (profile?.role === 'admin' ? 'admin' : 'user'),
          username: profile?.username,
        };
      }
    }
    next();
  } catch {
    // Proceed as unauthenticated guest
    next();
  }
};
