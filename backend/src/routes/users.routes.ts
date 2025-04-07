import { RequestHandler, Router } from 'express';
import {
            getMyProfileController,
            updateMyProfileController,
            listUsersController,
        } from '../controllers/users.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { requireAdmin } from '../middlewares/admin.middleware'; // Optional admin-only check

const router = Router();

router.get('/me', authenticate as RequestHandler, getMyProfileController);
router.put('/me', authenticate as RequestHandler, updateMyProfileController);

// Optional: Admin access to view all users
router.get('/', authenticate as RequestHandler, requireAdmin as RequestHandler, listUsersController);

export default router;
