import { Request, Response, NextFunction } from 'express';
import { MAX_NOTE_LENGTH } from '../types/note.types.js';

export const validateNoteInput = (req: Request, res: Response, next: NextFunction): void => {
  const { problem_id, content } = req.body;

  if (content === undefined || content === null) {
    res.status(400).json({
      success: false,
      error: 'Note content is required',
      timestamp: new Date().toISOString(),
    });
    return;
  }

  if (typeof content !== 'string') {
    res.status(400).json({
      success: false,
      error: 'Note content must be a string',
      timestamp: new Date().toISOString(),
    });
    return;
  }

  if (content.length > MAX_NOTE_LENGTH) {
    res.status(400).json({
      success: false,
      error: `Note content exceeds the maximum limit of ${MAX_NOTE_LENGTH} characters. Current length: ${content.length}`,
      timestamp: new Date().toISOString(),
    });
    return;
  }

  // If method is POST or route needs problem_id
  if (req.method === 'POST' && (!problem_id || typeof problem_id !== 'string')) {
    res.status(400).json({
      success: false,
      error: 'Valid problem_id is required',
      timestamp: new Date().toISOString(),
    });
    return;
  }

  next();
};
