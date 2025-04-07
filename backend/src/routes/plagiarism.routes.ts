import { Router } from 'express';
import { getPlagiarizedSubmissions } from '../controllers/plagiarism.controller';

const router = Router();

router.get('/plagiarism/:contestId', getPlagiarizedSubmissions);

export default router;
