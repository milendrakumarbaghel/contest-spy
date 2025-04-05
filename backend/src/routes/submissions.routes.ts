import { Router, RequestHandler } from 'express';
import { submitSolution } from '../controllers/submissions.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { SubmissionSchema } from '../validators/submission.validator';

const router = Router();

router.post('/:problemId', authenticate as RequestHandler, validate(SubmissionSchema) as RequestHandler, submitSolution);

export default router;
