import { Request, Response, NextFunction } from 'express';
import { userService } from '../services/user.service.js';
import { ApiResponse } from '../types/api.types.js';

export const getMe = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user!.id;
    const profile = await userService.getProfile(userId);
    const progress = await userService.getUserProgress(userId);

    const response: ApiResponse = {
      success: true,
      data: {
        profile,
        progress,
      },
      timestamp: new Date().toISOString(),
    };
    res.json(response);
  } catch (error) {
    next(error);
  }
};

export const updateMe = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user!.id;
    const { username } = req.body;

    const updated = await userService.updateProfile(userId, { username });

    const response: ApiResponse = {
      success: true,
      message: 'Profile updated successfully',
      data: updated,
      timestamp: new Date().toISOString(),
    };
    res.json(response);
  } catch (error) {
    next(error);
  }
};

export const syncProgress = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user!.id;
    const { solved_problem_ids, bookmarked_problem_ids } = req.body;

    const progress = await userService.syncProgress(
      userId,
      Array.isArray(solved_problem_ids) ? solved_problem_ids : [],
      Array.isArray(bookmarked_problem_ids) ? bookmarked_problem_ids : []
    );

    const response: ApiResponse = {
      success: true,
      message: 'Progress synced successfully',
      data: progress,
      timestamp: new Date().toISOString(),
    };
    res.json(response);
  } catch (error) {
    next(error);
  }
};
