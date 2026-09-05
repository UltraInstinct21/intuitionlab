import { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import { randomUUID } from 'crypto';
import { Profile } from 'passport-google-oauth20';
import { config } from '../config/env.js';
import { supabaseAdmin } from '../config/supabase.js';
import { isGoogleEnabled } from '../config/passport.js';
import { ApiResponse } from '../types/api.types.js';

const errorRedirect = (res: Response, message: string): void => {
  res.redirect(`${config.corsOrigin}/auth/callback?error=${encodeURIComponent(message)}`);
};

// Only allow relative redirect targets — blocks open-redirect abuse via ?next=
const safeNextPath = (value: unknown): string =>
  typeof value === 'string' && value.startsWith('/') && !value.startsWith('//') ? value : '/';

// GET /api/v1/auth/google?next=/path — start the Google OAuth flow
export const googleAuthStart = (req: Request, res: Response, next: NextFunction): void => {
  if (!isGoogleEnabled()) {
    res.status(503).json({
      success: false,
      error: 'Google sign-in is not configured on the server (missing GOOGLE_* env vars or JWT_SECRET)',
      timestamp: new Date().toISOString(),
    });
    return;
  }
  // Signed `state` doubles as CSRF protection — verified in the callback
  const state = jwt.sign({ next: safeNextPath(req.query.next), nonce: randomUUID() }, config.jwt.secret, {
    expiresIn: '10m',
  });
  passport.authenticate('google', { scope: ['profile', 'email'], session: false, state })(req, res, next);
};

// GET /api/v1/auth/google/callback — Google redirects here with ?code=&state=
export const googleAuthCallback = (req: Request, res: Response, next: NextFunction): void => {
  if (!isGoogleEnabled()) {
    errorRedirect(res, 'Google sign-in is not configured on the server');
    return;
  }
  passport.authenticate('google', { session: false }, async (err: unknown, profile: Profile | false) => {
    try {
      const { next: nextPath } = jwt.verify(String(req.query.state || ''), config.jwt.secret) as { next: string };
      if (err || !profile) {
        throw err instanceof Error ? err : new Error('Google authentication failed');
      }
      const email = profile.emails?.[0]?.value?.toLowerCase();
      if (!email) {
        throw new Error('Google did not return an email address');
      }
      if (!supabaseAdmin) {
        throw new Error('Server user store (Supabase) is not configured');
      }
      const username =
        profile.displayName?.replace(/\s+/g, '_').toLowerCase().slice(0, 32) || email.split('@')[0];
      const authUser = await findOrCreateAuthUser(email, username);
      const token = jwt.sign({ sub: authUser.id, email }, config.jwt.secret, {
        expiresIn: config.jwt.expiresIn as `${number}${'s' | 'm' | 'h' | 'd'}`,
      });
      res.redirect(`${config.corsOrigin}${safeNextPath(nextPath)}?token=${token}`);
    } catch (error) {
      errorRedirect(res, error instanceof Error ? error.message : 'Google sign-in failed');
    }
  })(req, res, next);
};

// GET /api/v1/auth/status — lets the frontend show/hide the Google button
export const getAuthStatus = (_req: Request, res: Response): void => {
  const response: ApiResponse = {
    success: true,
    data: { google: isGoogleEnabled() },
    timestamp: new Date().toISOString(),
  };
  res.json(response);
};

// GET /api/v1/auth/me — validate the app token, return user + profile
export const getAuthMe = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const response: ApiResponse = {
      success: true,
      data: { user: req.user },
      timestamp: new Date().toISOString(),
    };
    res.json(response);
  } catch (error) {
    next(error);
  }
};

// Find the Supabase auth user by email, creating + confirming one if absent,
// and ensure a matching `profiles` row exists (role preserved on conflict).
async function findOrCreateAuthUser(email: string, username: string): Promise<{ id: string }> {
  const admin = supabaseAdmin!;
  const { data: created, error: createError } = await admin.auth.admin.createUser({
    email,
    email_confirm: true,
    user_metadata: { username, provider: 'google' },
  });
  let userId = created?.user?.id;
  if (!userId) {
    if (createError && !/already|exists|registered/i.test(createError.message)) {
      throw createError;
    }
    userId = await findAuthUserIdByEmail(email);
  }
  const { data: existing } = await admin.from('profiles').select('id').eq('id', userId).maybeSingle();
  if (existing) {
    await admin.from('profiles').update({ email, username, updated_at: new Date().toISOString() }).eq('id', userId);
  } else {
    await admin.from('profiles').insert({ id: userId, email, username, role: 'user' });
  }
  return { id: userId };
}

async function findAuthUserIdByEmail(email: string): Promise<string> {
  const admin = supabaseAdmin!;
  for (let page = 1; page <= 10; page++) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 100 });
    if (error) throw error;
    const found = data.users.find((u) => u.email?.toLowerCase() === email);
    if (found) return found.id;
    if (data.users.length < 100) break;
  }
  throw new Error('Could not find an account for this email');
}
