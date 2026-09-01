export interface ProblemNote {
  id: string;
  user_id: string;
  problem_id: string;
  content: string; // Max 250 characters enforced
  created_at: string;
  updated_at: string;
}

export interface CreateOrUpdateNoteDto {
  problem_id: string;
  content: string;
}

export const MAX_NOTE_LENGTH = 250;
