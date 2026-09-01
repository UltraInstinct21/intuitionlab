import { Request, Response, NextFunction } from 'express';
import { adminService } from '../services/admin.service.js';
import { ApiResponse, PaginatedResponse } from '../types/api.types.js';

export const listUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string || '1', 10);
    const limit = parseInt(req.query.limit as string || '20', 10);
    const search = req.query.search as string | undefined;
    const role = req.query.role as string | undefined;

    const { users, total } = await adminService.getUsers(page, limit, search, role);

    const response: PaginatedResponse<any> = {
      success: true,
      data: users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      timestamp: new Date().toISOString(),
    };
    res.json(response);
  } catch (error) {
    next(error);
  }
};

export const changeUserRole = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const { role } = req.body;

    if (role !== 'user' && role !== 'admin') {
      res.status(400).json({
        success: false,
        error: 'Invalid role. Must be "user" or "admin"',
        timestamp: new Date().toISOString(),
      });
      return;
    }

    await adminService.updateUserRole(id, role);

    const response: ApiResponse = {
      success: true,
      message: `User role updated to ${role}`,
      timestamp: new Date().toISOString(),
    };
    res.json(response);
  } catch (error) {
    next(error);
  }
};

export const getAnalytics = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const metrics = await adminService.getSystemMetrics();

    const response: ApiResponse = {
      success: true,
      data: metrics,
      timestamp: new Date().toISOString(),
    };
    res.json(response);
  } catch (error) {
    next(error);
  }
};

export const getSettings = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const settings = adminService.getSystemSettings();

    const response: ApiResponse = {
      success: true,
      data: settings,
      timestamp: new Date().toISOString(),
    };
    res.json(response);
  } catch (error) {
    next(error);
  }
};

export const updateSettings = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const updates = req.body;
    const updated = adminService.updateSystemSettings(updates);

    const response: ApiResponse = {
      success: true,
      message: 'System settings updated successfully',
      data: updated,
      timestamp: new Date().toISOString(),
    };
    res.json(response);
  } catch (error) {
    next(error);
  }
};
