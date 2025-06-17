import { Router } from 'express';
import { UserController } from '../controllers/userController';
import { authenticate } from '../middleware/auth';
import { authRateLimiter } from '../middleware/rateLimiter';

const router = Router();

router.post('/', authRateLimiter, UserController.register);
router.post('/auth', authRateLimiter, UserController.login);

router.get('/verify', authenticate, UserController.verify);

export default router;