import { Router, RequestHandler } from 'express';
import { createContest } from '../controllers/contests.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { CreateContestSchema } from '../validators/contest.validator';

const router = Router();

router.post('/', authenticate as RequestHandler, validate(CreateContestSchema) as RequestHandler, createContest);

export default router;
