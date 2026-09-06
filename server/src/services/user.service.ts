import { supabaseAdmin } from '../config/supabase.js';
import { UserProfile, UserProgress } from '../types/user.types.js';

export class UserService {
  async getProfile(userId: string): Promise<UserProfile | null> {
    if (!supabaseAdmin) {
      return {
        id: userId,
        email: 'dev@intuitionlab.local',
        username: 'DevAdmin',
        role: 'admin',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
    }

    const { data, error } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      throw new Error(`Failed to fetch profile: ${error.message}`);
    }

    return data;
  }

  async updateProfile(userId: string, updates: { username?: string }): Promise<UserProfile> {
    const now = new Date().toISOString();

    if (!supabaseAdmin) {
      return {
        id: userId,
        email: 'dev@intuitionlab.local',
        role: 'user',
        created_at: now,
        username: updates.username,
        updated_at: now,
      };
    }

    const { data, error } = await supabaseAdmin
      .from('profiles')
      .update({
        username: updates.username,
        updated_at: now,
      })
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update profile: ${error.message}`);
    }

    return data;
  }

  async getUserProgress(userId: string): Promise<UserProgress> {
    if (!supabaseAdmin) {
      return {
        user_id: userId,
        solved_problem_ids: [],
        bookmarked_problem_ids: [],
        updated_at: new Date().toISOString(),
      };
    }

    const { data, error } = await supabaseAdmin
      .from('user_progress')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      throw new Error(`Failed to fetch user progress: ${error.message}`);
    }

    return data || {
      user_id: userId,
      solved_problem_ids: [],
      bookmarked_problem_ids: [],
      updated_at: new Date().toISOString(),
    };
  }

  async syncProgress(
    userId: string,
    solvedIds: string[],
    bookmarkedIds: string[]
  ): Promise<UserProgress> {
    const now = new Date().toISOString();

    if (!supabaseAdmin) {
      return {
        user_id: userId,
        solved_problem_ids: solvedIds,
        bookmarked_problem_ids: bookmarkedIds,
        updated_at: now,
      };
    }

    const { data, error } = await supabaseAdmin
      .from('user_progress')
      .upsert({
        user_id: userId,
        solved_problem_ids: solvedIds,
        bookmarked_problem_ids: bookmarkedIds,
        updated_at: now,
      })
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to sync progress: ${error.message}`);
    }

    return data;
  }
}

export const userService = new UserService();
