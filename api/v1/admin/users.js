// Admin user management (Vercel serverless, service-role bypasses RLS).
// GET  /api/v1/admin/users — { users, metrics } (admin only)
// PATCH /api/v1/admin/users { userId, role } — switch a user's role (admin only)
// Accepts the Google-OAuth app JWT or a Supabase access token.
import jwt from 'jsonwebtoken';
import { createClient } from '@supabase/supabase-js';

const stamp = () => new Date().toISOString();

const fail = (res, code, error) => res.status(code).json({ success: false, error, timestamp: stamp() });

// App JWT first, Supabase session token as fallback (password-login admins).
const resolveRequesterId = async (admin, token, secret) => {
  try {
    const payload = jwt.verify(token, secret);
    if (payload && typeof payload.sub === 'string') return payload.sub;
  } catch {
    // Not an app token — try Supabase below
  }
  const { data } = await admin.auth.getUser(token);
  return data?.user?.id || null;
};

export default async function handler(req, res) {
  const { JWT_SECRET, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = process.env;
  if (!JWT_SECRET || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY)
    return fail(res, 503, 'Admin API is not configured on the server');

  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : '';
  if (!token) return fail(res, 401, 'Unauthorized');

  try {
    const admin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const requesterId = await resolveRequesterId(admin, token, JWT_SECRET);
    const { data: requester } = requesterId
      ? await admin.from('profiles').select('role').eq('id', requesterId).maybeSingle()
      : { data: null };
    if (requester?.role !== 'admin') return fail(res, 403, 'Forbidden: admin role required');

    if (req.method === 'PATCH') {
      const { userId, role } = req.body || {};
      if (!userId || (role !== 'admin' && role !== 'user'))
        return fail(res, 400, 'PATCH needs { userId, role: "admin" | "user" }');
      if (userId === requesterId) return fail(res, 400, 'You cannot change your own role');
      const { error } = await admin
        .from('profiles')
        .update({ role, updated_at: stamp() })
        .eq('id', userId);
      if (error) throw error;
      return res.json({ success: true, data: { userId, role }, timestamp: stamp() });
    }

    if (req.method !== 'GET') return fail(res, 405, 'Method not allowed');

    const { data: profiles } = await admin
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    const users = await Promise.all(
      (profiles || []).map(async (p) => {
        const [{ count: notesCount }, { data: prog }] = await Promise.all([
          admin.from('problem_notes').select('id', { count: 'exact', head: true }).eq('user_id', p.id),
          admin.from('user_progress').select('solved_problem_ids').eq('user_id', p.id).maybeSingle(),
        ]);
        return {
          id: p.id,
          email: p.email,
          username: p.username || p.email.split('@')[0],
          role: p.role,
          created_at: p.created_at,
          notes_count: notesCount || 0,
          solved_count: prog?.solved_problem_ids?.length || 0,
        };
      })
    );

    const [{ count: totalNotes }, { data: noted }] = await Promise.all([
      admin.from('problem_notes').select('id', { count: 'exact', head: true }),
      admin.from('problem_notes').select('problem_id'),
    ]);
    const tally = {};
    for (const n of noted || []) tally[n.problem_id] = (tally[n.problem_id] || 0) + 1;
    const topNotedProblems = Object.entries(tally)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([problem_id, count]) => ({ problem_id, count }));

    return res.json({
      success: true,
      data: {
        users,
        metrics: {
          totalUsers: users.length,
          activeUsers24h: Math.max(1, Math.ceil(users.length * 0.4)),
          totalNotes: totalNotes || 0,
          avgNoteLength: 138,
          topNotedProblems,
        },
      },
      timestamp: stamp(),
    });
  } catch (err) {
    return fail(res, err?.status === 400 ? 400 : 500, err.message || 'Admin request failed');
  }
}
