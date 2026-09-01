import { Request, Response, NextFunction } from 'express';
import { notesService } from '../services/notes.service.js';
import { ApiResponse } from '../types/api.types.js';

export const getNotes = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user!.id;
    const notes = await notesService.getUserNotes(userId);

    const response: ApiResponse = {
      success: true,
      data: notes,
      timestamp: new Date().toISOString(),
    };
    res.json(response);
  } catch (error) {
    next(error);
  }
};

export const getNoteByProblemId = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user!.id;
    const problemId = Array.isArray(req.params.problemId) ? req.params.problemId[0] : req.params.problemId;

    const note = await notesService.getNoteByProblem(userId, problemId);

    const response: ApiResponse = {
      success: true,
      data: note,
      timestamp: new Date().toISOString(),
    };
    res.json(response);
  } catch (error) {
    next(error);
  }
};

export const saveNote = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user!.id;
    const { problem_id, content } = req.body;

    const note = await notesService.saveOrUpdateNote(userId, problem_id, content);

    const response: ApiResponse = {
      success: true,
      message: 'Note saved successfully',
      data: note,
      timestamp: new Date().toISOString(),
    };
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

export const deleteNote = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user!.id;
    const problemId = Array.isArray(req.params.problemId) ? req.params.problemId[0] : req.params.problemId;

    await notesService.deleteNote(userId, problemId);

    const response: ApiResponse = {
      success: true,
      message: 'Note deleted successfully',
      timestamp: new Date().toISOString(),
    };
    res.json(response);
  } catch (error) {
    next(error);
  }
};
