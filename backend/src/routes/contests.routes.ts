import { Router } from 'express';
import { createContest } from '../controllers/contests.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { CreateContestSchema } from '../validators/contest.validator';

const router = Router();

router.post('/', authenticate, validate(CreateContestSchema), createContest);

export default router;
