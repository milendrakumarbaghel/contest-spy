import { Router } from 'express';
import { calculateResults } from '../controllers/result.controller';

const router = Router();

router.post('/results/:contestId/calculate', calculateResults);

export default router;
