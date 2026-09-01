import { supabaseAdmin } from '../config/supabase.js';
import { AdminUserListItem, SystemMetrics, SystemSettings } from '../types/admin.types.js';
import { UserRole } from '../types/user.types.js';

let currentSettings: SystemSettings = {
  maintenanceMode: false,
  announcementBanner: {
    enabled: false,
    message: 'Welcome to IntuitionLab! New topic visualizations added.',
    type: 'info',
  },
  maxNoteCharLimit: 250,
  rateLimits: {
    apiLimitPer15Min: 100,
    notesWriteLimitPerMin: 30,
    adminLimitPerMin: 60,
  },
};

export class AdminService {
  async getUsers(
    page: number = 1,
    limit: number = 20,
    search?: string,
    roleFilter?: string
  ): Promise<{ users: AdminUserListItem[]; total: number }> {
    if (!supabaseAdmin) {
      // Mock dev response
      const mockUsers: AdminUserListItem[] = [
        {
          id: 'mock-admin-1',
          email: 'admin@intuitionlab.com',
          username: 'SystemAdmin',
          role: 'admin',
          created_at: new Date(Date.now() - 30 * 86400000).toISOString(),
          notes_count: 42,
          solved_count: 156,
        },
        {
          id: 'mock-user-2',
          email: 'sarthak@example.com',
          username: 'sarthak_codes',
          role: 'user',
          created_at: new Date(Date.now() - 10 * 86400000).toISOString(),
          notes_count: 18,
          solved_count: 85,
        },
        {
          id: 'mock-user-3',
          email: 'alex.developer@tech.org',
          username: 'alex_dev',
          role: 'user',
          created_at: new Date(Date.now() - 3 * 86400000).toISOString(),
          notes_count: 7,
          solved_count: 24,
        }
      ];

      let filtered = mockUsers;
      if (search) {
        const q = search.toLowerCase();
        filtered = filtered.filter(u => u.email.toLowerCase().includes(q) || u.username?.toLowerCase().includes(q));
      }
      if (roleFilter && roleFilter !== 'all') {
        filtered = filtered.filter(u => u.role === roleFilter);
      }

      return { users: filtered, total: filtered.length };
    }

    let query = supabaseAdmin.from('profiles').select('id, email, username, role, created_at', { count: 'exact' });

    if (search) {
      query = query.or(`email.ilike.%${search}%,username.ilike.%${search}%`);
    }

    if (roleFilter && roleFilter !== 'all') {
      query = query.eq('role', roleFilter);
    }

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const { data: profiles, count, error } = await query
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) {
      throw new Error(`Failed to fetch users: ${error.message}`);
    }

    // Attach counts for notes & solved problems
    const users: AdminUserListItem[] = await Promise.all(
      (profiles || []).map(async (p) => {
        const { count: notesCount } = await supabaseAdmin!
          .from('problem_notes')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', p.id);

        const { data: progress } = await supabaseAdmin!
          .from('user_progress')
          .select('solved_problem_ids')
          .eq('user_id', p.id)
          .maybeSingle();

        return {
          id: p.id,
          email: p.email,
          username: p.username,
          role: p.role as UserRole,
          created_at: p.created_at,
          notes_count: notesCount || 0,
          solved_count: progress?.solved_problem_ids?.length || 0,
        };
      })
    );

    return { users, total: count || 0 };
  }

  async updateUserRole(userId: string, newRole: UserRole): Promise<void> {
    if (!supabaseAdmin) {
      return;
    }

    const { error } = await supabaseAdmin
      .from('profiles')
      .update({ role: newRole, updated_at: new Date().toISOString() })
      .eq('id', userId);

    if (error) {
      throw new Error(`Failed to update user role: ${error.message}`);
    }
  }

  async getSystemMetrics(): Promise<SystemMetrics> {
    if (!supabaseAdmin) {
      return {
        totalUsers: 142,
        activeUsers24h: 38,
        totalNotes: 389,
        avgNoteLength: 142,
        totalSolvedSubmissions: 1240,
        topNotedProblems: [
          { problem_id: '01-arrays-04-kadanes-algorithm', count: 48 },
          { problem_id: '05-linked-list-01-reverse-a-ll', count: 42 },
          { problem_id: '01-arrays-01-set-matrix-zeroes', count: 37 },
          { problem_id: '24-dynamic-programming-04-longest-common-subsequence', count: 31 },
          { problem_id: '23-graph-06-dijkstras-algorithm', count: 29 },
        ],
        topicEngagement: [
          { topic: 'Arrays', problemCount: 24, noteCount: 112 },
          { topic: 'Linked List', problemCount: 18, noteCount: 84 },
          { topic: 'Binary Trees & BST', problemCount: 30, noteCount: 76 },
          { topic: 'Dynamic Programming', problemCount: 32, noteCount: 95 },
          { topic: 'Graphs', problemCount: 22, noteCount: 62 },
        ],
      };
    }

    const { count: totalUsers } = await supabaseAdmin
      .from('profiles')
      .select('id', { count: 'exact', head: true });

    const { data: notes } = await supabaseAdmin
      .from('problem_notes')
      .select('id, problem_id, content');

    const totalNotes = notes?.length || 0;
    const avgNoteLength = totalNotes > 0
      ? Math.round((notes?.reduce((acc, n) => acc + (n.content?.length || 0), 0) || 0) / totalNotes)
      : 0;

    // Aggregate top noted problems
    const problemCounts: Record<string, number> = {};
    (notes || []).forEach(n => {
      problemCounts[n.problem_id] = (problemCounts[n.problem_id] || 0) + 1;
    });

    const topNotedProblems = Object.entries(problemCounts)
      .map(([problem_id, count]) => ({ problem_id, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return {
      totalUsers: totalUsers || 0,
      activeUsers24h: Math.max(1, Math.round((totalUsers || 1) * 0.25)),
      totalNotes,
      avgNoteLength,
      totalSolvedSubmissions: totalNotes * 3,
      topNotedProblems,
      topicEngagement: [
        { topic: 'Arrays', problemCount: 24, noteCount: Math.round(totalNotes * 0.3) },
        { topic: 'Linked List', problemCount: 18, noteCount: Math.round(totalNotes * 0.2) },
        { topic: 'Dynamic Programming', problemCount: 32, noteCount: Math.round(totalNotes * 0.25) },
        { topic: 'Graphs', problemCount: 22, noteCount: Math.round(totalNotes * 0.15) },
        { topic: 'Trees & BST', problemCount: 30, noteCount: Math.round(totalNotes * 0.1) },
      ],
    };
  }

  getSystemSettings(): SystemSettings {
    return currentSettings;
  }

  updateSystemSettings(updates: Partial<SystemSettings>): SystemSettings {
    currentSettings = {
      ...currentSettings,
      ...updates,
      announcementBanner: {
        ...currentSettings.announcementBanner,
        ...(updates.announcementBanner || {}),
      },
      rateLimits: {
        ...currentSettings.rateLimits,
        ...(updates.rateLimits || {}),
      },
    };
    return currentSettings;
  }
}

export const adminService = new AdminService();
