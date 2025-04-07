import { Router, RequestHandler } from 'express';
import { getRankingController } from '../controllers/rankings.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.get('/:contestId', authenticate as RequestHandler, getRankingController);

export default router;
