import { UserRole } from './user.types.js';

export interface AdminUserListItem {
  id: string;
  email: string;
  username?: string;
  role: UserRole;
  created_at: string;
  notes_count: number;
  solved_count: number;
}

export interface SystemMetrics {
  totalUsers: number;
  activeUsers24h: number;
  totalNotes: number;
  avgNoteLength: number;
  totalSolvedSubmissions: number;
  topNotedProblems: { problem_id: string; count: number }[];
  topicEngagement: { topic: string; problemCount: number; noteCount: number }[];
}

export interface SystemSettings {
  maintenanceMode: boolean;
  announcementBanner: {
    enabled: boolean;
    message: string;
    type: 'info' | 'warning' | 'announcement';
  };
  maxNoteCharLimit: number;
  rateLimits: {
    apiLimitPer15Min: number;
    notesWriteLimitPerMin: number;
    adminLimitPerMin: number;
  };
}
