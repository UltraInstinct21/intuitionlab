// GET /api/v1/auth/google/callback?code=…&state=… — finish Google OAuth.
// Stateless: verifies the signed state JWT, exchanges the code via fetch,
// provisions the Supabase user, and redirects home with ?token=<app JWT>.
import jwt from 'jsonwebtoken';
import { createClient } from '@supabase/supabase-js';

const safeNextPath = (value) =>
  typeof value === 'string' && value.startsWith('/') && !value.startsWith('//') ? value : '/';

// ponytail: duplicated from server/src/controllers/auth.controller.ts — one shared
// npm package is the "right" answer, four serverless files don't justify it.
const findAuthUserIdByEmail = async (admin, email) => {
  for (let page = 1; page <= 10; page++) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 100 });
    if (error) throw error;
    const match = data.users.find((u) => u.email?.toLowerCase() === email);
    if (match) return match.id;
    if (data.users.length < 100) return null;
  }
  return null;
};

export default async function handler(req, res) {
  const {
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    GOOGLE_CALLBACK_URL,
    JWT_SECRET,
    JWT_EXPIRES_IN,
    SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY,
  } = process.env;
  const frontend = process.env.FRONTEND_URL || `https://${req.headers.host}`;
  const fail = (message) =>
    res.redirect(`${frontend}/auth/callback?error=${encodeURIComponent(message)}`);

  try {
    if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !GOOGLE_CALLBACK_URL || !JWT_SECRET)
      return fail('Google sign-in is not configured on the server');
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY)
      return fail('Server user store is not configured');

    const { next } = jwt.verify(String(req.query.state || ''), JWT_SECRET);

    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code: String(req.query.code || ''),
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: GOOGLE_CALLBACK_URL,
        grant_type: 'authorization_code',
      }),
    });
    const tokenJson = await tokenRes.json();
    if (!tokenJson.access_token)
      throw new Error(tokenJson.error_description || 'Google code exchange failed');

    const meRes = await fetch('https://openidconnect.googleapis.com/v1/userinfo', {
      headers: { Authorization: `Bearer ${tokenJson.access_token}` },
    });
    const info = await meRes.json();
    const email = typeof info.email === 'string' ? info.email.toLowerCase() : '';
    if (!email) throw new Error('Google did not return an email address');

    const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    let userId = null;
    const { data: created, error: createError } = await admin.auth.admin.createUser({
      email,
      email_confirm: true,
      user_metadata: { username: info.name || email.split('@')[0], avatar_url: info.picture },
    });
    if (!createError) {
      userId = created.user.id;
    } else if (createError.message.toLowerCase().includes('already been registered')) {
      userId = await findAuthUserIdByEmail(admin, email);
    } else {
      throw createError;
    }
    if (!userId) throw new Error('Could not provision user account');

    const { data: profile } = await admin
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .maybeSingle();
    await admin.from('profiles').upsert(
      {
        id: userId,
        email,
        username: info.name || profile?.username || email.split('@')[0],
        role: profile?.role === 'admin' ? 'admin' : 'user',
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'id' }
    );

    const token = jwt.sign({ sub: userId, email }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN || '7d',
    });
    res.redirect(`${frontend}${safeNextPath(next)}?token=${token}`);
  } catch (err) {
    fail(err.message || 'Google sign-in failed');
  }
}
