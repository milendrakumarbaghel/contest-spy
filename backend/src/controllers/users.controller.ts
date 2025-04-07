import { Request, RequestHandler, Response } from 'express';
import * as userService from '../services/user.service';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import multer from 'multer';
const upload = multer(); // in-memory for avatar upload

export const getMyProfileController = async (req: Request, res: Response) => {
  const userId = (req as Request & { user: { id: string } }).user.id;

  try {
    const user = await userService.getUserById(userId);
    res.status(200).json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch profile' });
  }
};

export const updateMyProfileController = async (req: Request, res: Response) => {
  const userId = (req as Request & { user: { id: string } }).user.id;
  const { username, email } = req.body;

  try {
    const updated = await userService.updateUserProfile(userId, { username, email });
    res.status(200).json({ success: true, user: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update profile' });
  }
};

export const listUsersController = async (req: Request, res: Response) => {
  const { page = '1', limit = '20', search = '' } = req.query;

  try {
    const result = await userService.listUsers(Number(page), Number(limit), String(search));
    res.status(200).json({ success: true, ...result });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to list users' });
  }
};

export const uploadAvatarController: RequestHandler = async (req, res) => {
  try {
    const userId = (req as any).user.id;
    const file = req.file;

    if (!file) {
      res.status(400).json({ success: false, message: 'No file uploaded' });
      return;
    }

    const avatarUrl = await userService.uploadAvatar(userId, file);
    res.json({ success: true, avatar: avatarUrl });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    res.status(500).json({ success: false, message: errorMessage });
  }
};

export const changePasswordController = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { oldPassword, newPassword } = req.body;

    await userService.changePassword(userId, oldPassword, newPassword);
    res.json({ success: true, message: 'Password changed' });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    res.status(400).json({ success: false, message: errorMessage });
  }
};

export const resetPasswordController = async (req: Request, res: Response) => {
  try {
    const { email, newPassword } = req.body;
    await userService.resetPassword(email, newPassword);
    res.json({ success: true, message: 'Password reset' });
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'An unexpected error occurred';
    res.status(400).json({ success: false, message: errorMsg });
  }
};

export const banUserController = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    await userService.banUser(userId);
    res.json({ success: true, message: 'User banned' });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    res.status(500).json({ success: false, message: errorMessage });
  }
};

export const unbanUserController = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    await userService.unbanUser(userId);
    res.json({ success: true, message: 'User unbanned' });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    res.status(500).json({ success: false, message: errorMessage });
  }
};
