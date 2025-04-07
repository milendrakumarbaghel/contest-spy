import { RequestHandler, Router } from 'express';
import { getRankingController, getMyRankController } from '../controllers/rankings.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.get('/:contestId', authenticate as RequestHandler, getRankingController);      // Full leaderboard
router.get('/:contestId/my-rank', authenticate as RequestHandler, getMyRankController); // Personal rank

export default router;
