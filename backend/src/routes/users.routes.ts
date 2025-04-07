import express, { RequestHandler } from 'express';
import multer from 'multer';
import {
    getMyProfileController,
    updateMyProfileController,
    listUsersController,
    uploadAvatarController,
    changePasswordController,
    resetPasswordController,
    banUserController,
    unbanUserController,
} from '../controllers/users.controller';
import { authenticate, requireAdmin } from '../middlewares/auth.middleware';
const router = express.Router();
const upload = multer(); // in-memory for avatar upload

// 🧍‍♂️ Authenticated user routes
router.get('/me', authenticate as RequestHandler, getMyProfileController);
router.put('/updateMe', authenticate as RequestHandler, updateMyProfileController);
router.post('/avatar', authenticate as RequestHandler, upload.single('avatar'), uploadAvatarController);
router.post('/change-password', authenticate as RequestHandler, changePasswordController);

// Optional: Admin access to view all users
router.get('/', authenticate as RequestHandler, requireAdmin as RequestHandler, listUsersController);

// 🔐 Public password reset
router.post('/reset-password', resetPasswordController);

// 🔨 Admin-only routes
router.patch('/ban/:userId', authenticate as RequestHandler, requireAdmin as RequestHandler, banUserController);
router.patch('/unban/:userId', authenticate as RequestHandler, requireAdmin as RequestHandler, unbanUserController);

export default router;
