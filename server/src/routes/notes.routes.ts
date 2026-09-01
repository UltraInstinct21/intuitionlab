import { Router } from 'express';
import { getNotes, getNoteByProblemId, saveNote, deleteNote } from '../controllers/notes.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { notesWriteLimiter } from '../middlewares/rateLimiter.middleware.js';
import { validateNoteInput } from '../middlewares/validation.middleware.js';

const router = Router();

// All notes routes require authentication
router.use(authMiddleware);

// GET /api/v1/notes - Get all notes for the authenticated user
router.get('/', getNotes);

// GET /api/v1/notes/:problemId - Get specific problem note
router.get('/:problemId', getNoteByProblemId);

// POST /api/v1/notes - Create or update problem note (enforcing rate limiting & 250 char limit)
router.post('/', notesWriteLimiter, validateNoteInput, saveNote);

// PUT /api/v1/notes/:problemId - Update problem note
router.put('/:problemId', notesWriteLimiter, validateNoteInput, (req, res, next) => {
  req.body.problem_id = req.params.problemId;
  saveNote(req, res, next);
});

// DELETE /api/v1/notes/:problemId - Delete problem note
router.delete('/:problemId', deleteNote);

export default router;
