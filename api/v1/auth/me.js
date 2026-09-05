// GET /api/v1/auth/me — validate the app JWT, return the user + role.
import jwt from 'jsonwebtoken';
import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : '';
  try {
    if (!process.env.JWT_SECRET) throw new Error('no secret');
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    if (!payload || typeof payload.sub !== 'string') throw new Error('no sub');
    const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = process.env;
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) throw new Error('no store');
    const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const { data: profile } = await admin
      .from('profiles')
      .select('id, email, username, role')
      .eq('id', payload.sub)
      .maybeSingle();
    res.json({
      success: true,
      data: {
        user: {
          id: payload.sub,
          email: payload.email || profile?.email || '',
          role: profile?.role === 'admin' ? 'admin' : 'user',
          username: profile?.username,
        },
      },
      timestamp: new Date().toISOString(),
    });
  } catch {
    res.status(401).json({
      success: false,
      error: 'Unauthorized: Invalid or expired token',
      timestamp: new Date().toISOString(),
    });
  }
}
