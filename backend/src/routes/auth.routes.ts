import { Router } from 'express';
import { register, login } from '../controllers/auth.controller';
import { validate } from '../middlewares/validate.middleware';
import { RegisterSchema, LoginSchema } from '../validators/auth.validator';

const router = Router();

router.post('/register', validate(RegisterSchema) as any, register);
router.post('/login', validate(LoginSchema) as any, login);

export default router;
