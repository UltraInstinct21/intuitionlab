import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';
import { supabaseAdmin } from '../config/supabase.js';
import { AuthenticatedUser } from '../types/user.types.js';

// Extend Passport's Express.User so req.user carries our fields everywhere
declare global {
  namespace Express {
    interface User {
      id: string;
      email: string;
      role: 'user' | 'admin';
      username?: string;
    }
  }
}

// Resolve id + role from either token type, then load the profile row.
async function loadAuthenticatedUser(id: string, email: string): Promise<AuthenticatedUser> {
  if (!supabaseAdmin) {
    // Mock / Local Dev fallback if Supabase is not configured yet
    return { id, email, role: 'admin', username: 'DevAdmin' };
  }
  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('id, email, username, role')
    .eq('id', id)
    .single();

  return {
    id,
    email: email || profile?.email || '',
    role: (profile?.role === 'admin' ? 'admin' : 'user'),
    username: profile?.username,
  };
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

    // 1) App JWT (Google-OAuth users). Falls through to Supabase on any failure.
    if (config.jwt.secret) {
      try {
        const payload = jwt.verify(token, config.jwt.secret) as { sub?: string; email?: string };
        if (payload?.sub) {
          req.user = await loadAuthenticatedUser(payload.sub, payload.email || '');
          next();
          return;
        }
      } catch {
        // Not an app token — try Supabase below
      }
    }

    if (!supabaseAdmin) {
      req.user = await loadAuthenticatedUser('mock-user-id', 'dev@intuitionlab.local');
      next();
      return;
    }

    // 2) Supabase access token
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);

    if (authError || !user) {
      res.status(401).json({
        success: false,
        error: 'Unauthorized: Invalid or expired token',
        timestamp: new Date().toISOString(),
      });
      return;
    }

    req.user = await loadAuthenticatedUser(user.id, user.email || '');

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
