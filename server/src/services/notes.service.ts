import { supabaseAdmin } from '../config/supabase.js';
import { ProblemNote, MAX_NOTE_LENGTH } from '../types/note.types.js';

export class NotesService {
  async getUserNotes(userId: string): Promise<ProblemNote[]> {
    if (!supabaseAdmin) {
      return [];
    }

    const { data, error } = await supabaseAdmin
      .from('problem_notes')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false });

    if (error) {
      throw new Error(`Failed to fetch notes: ${error.message}`);
    }

    return data || [];
  }

  async getNoteByProblem(userId: string, problemId: string): Promise<ProblemNote | null> {
    if (!supabaseAdmin) {
      return null;
    }

    const { data, error } = await supabaseAdmin
      .from('problem_notes')
      .select('*')
      .eq('user_id', userId)
      .eq('problem_id', problemId)
      .maybeSingle();

    if (error) {
      throw new Error(`Failed to fetch note: ${error.message}`);
    }

    return data;
  }

  async saveOrUpdateNote(userId: string, problemId: string, content: string): Promise<ProblemNote> {
    if (content.length > MAX_NOTE_LENGTH) {
      throw new Error(`Note exceeds maximum limit of ${MAX_NOTE_LENGTH} characters`);
    }

    const now = new Date().toISOString();

    if (!supabaseAdmin) {
      return {
        id: `note-${Date.now()}`,
        user_id: userId,
        problem_id: problemId,
        content,
        created_at: now,
        updated_at: now,
      };
    }

    const { data, error } = await supabaseAdmin
      .from('problem_notes')
      .upsert(
        {
          user_id: userId,
          problem_id: problemId,
          content,
          updated_at: now,
        },
        { onConflict: 'user_id,problem_id' }
      )
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to save note: ${error.message}`);
    }

    return data;
  }

  async deleteNote(userId: string, problemId: string): Promise<boolean> {
    if (!supabaseAdmin) {
      return true;
    }

    const { error } = await supabaseAdmin
      .from('problem_notes')
      .delete()
      .eq('user_id', userId)
      .eq('problem_id', problemId);

    if (error) {
      throw new Error(`Failed to delete note: ${error.message}`);
    }

    return true;
  }
}

export const notesService = new NotesService();
