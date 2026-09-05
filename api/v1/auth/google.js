// GET /api/v1/auth/google?next=/path — start Google OAuth (Vercel serverless).
// Same flow as server/src/controllers/auth.controller.ts googleAuthStart.
import jwt from 'jsonwebtoken';
import { randomUUID } from 'crypto';

const safeNextPath = (value) =>
  typeof value === 'string' && value.startsWith('/') && !value.startsWith('//') ? value : '/';

export default function handler(req, res) {
  const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_CALLBACK_URL, JWT_SECRET } = process.env;
  if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !GOOGLE_CALLBACK_URL || !JWT_SECRET) {
    res.status(503).json({
      success: false,
      error: 'Google sign-in is not configured on the server',
      timestamp: new Date().toISOString(),
    });
    return;
  }
  const state = jwt.sign({ next: safeNextPath(req.query.next), nonce: randomUUID() }, JWT_SECRET, {
    expiresIn: '10m',
  });
  const url =
    'https://accounts.google.com/o/oauth2/v2/auth?' +
    new URLSearchParams({
      client_id: GOOGLE_CLIENT_ID,
      redirect_uri: GOOGLE_CALLBACK_URL,
      response_type: 'code',
      scope: 'openid email profile',
      state,
    });
  res.redirect(url);
}
