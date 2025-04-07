import { Request, Response } from 'express';
import { getUserById, updateUserProfile, listUsers } from '../services/user.service';

export const getMyProfileController = async (req: Request, res: Response) => {
  const userId = (req as Request & { user: { id: string } }).user.id;

  try {
    const user = await getUserById(userId);
    res.status(200).json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch profile' });
  }
};

export const updateMyProfileController = async (req: Request, res: Response) => {
  const userId = (req as Request & { user: { id: string } }).user.id;
  const { username, email } = req.body;

  try {
    const updated = await updateUserProfile(userId, { username, email });
    res.status(200).json({ success: true, user: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update profile' });
  }
};

export const listUsersController = async (req: Request, res: Response) => {
  const { page = '1', limit = '20', search = '' } = req.query;

  try {
    const result = await listUsers(Number(page), Number(limit), String(search));
    res.status(200).json({ success: true, ...result });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to list users' });
  }
};
