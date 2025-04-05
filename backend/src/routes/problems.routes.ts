import { RequestHandler, Router } from 'express';
import { createProblem, updateProblem, deleteProblem } from '../controllers/problems.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { CreateProblemSchema } from '../validators/problem.validator';

const router = Router();

router.post('/:contestId', authenticate as RequestHandler, validate(CreateProblemSchema) as RequestHandler, createProblem);
router.put('/:problemId', authenticate as RequestHandler, validate(CreateProblemSchema) as RequestHandler, updateProblem);
router.delete('/:problemId', authenticate as RequestHandler, deleteProblem);

export default router;
