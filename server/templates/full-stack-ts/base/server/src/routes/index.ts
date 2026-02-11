import { Router } from 'express';
import { authRoutes } from './authRoutes';
import { healthRoutes } from './healthRoutes';

export const apiRoutes = Router();

apiRoutes.use(healthRoutes);
apiRoutes.use(authRoutes);
