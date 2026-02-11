import { Router } from 'express';
import { login, me, register } from '../controllers/authController';
import { authMiddleware } from '../middlewares/authMiddleware';

export const authRoutes = Router();

authRoutes.post('/auth/register', register);
authRoutes.post('/auth/login', login);
authRoutes.get('/auth/me', authMiddleware, me);
