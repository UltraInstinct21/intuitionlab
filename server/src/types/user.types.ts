export type UserRole = 'user' | 'admin';

export interface UserProfile {
  id: string;
  email: string;
  username?: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
  last_sign_in_at?: string;
}

export interface UserProgress {
  user_id: string;
  solved_problem_ids: string[];
  bookmarked_problem_ids: string[];
  updated_at: string;
}

export interface AuthenticatedUser {
  id: string;
  email: string;
  role: UserRole;
  username?: string;
}
