import { Router } from 'express';
import { AuthController } from '@/interfaces/http/controllers/AuthController';
import { authMiddleware } from '@/interfaces/http/middlewares/authMiddleware';
import { validateRequest } from '@/interfaces/http/middlewares/validateRequest';
import {
  loginSchema,
  refreshTokenSchema,
  registerSchema
} from '@/interfaces/http/validators/authValidators';
import type { AppContainer } from '@/infrastructure/container';
import { asyncHandler } from '@/shared/utils/asyncHandler';

export function createAuthRoutes(container: AppContainer): Router {
  const router = Router();
  const controller = new AuthController(container);

  router.post('/register', validateRequest(registerSchema), asyncHandler(controller.register));
  router.post('/login', validateRequest(loginSchema), asyncHandler(controller.login));
  router.post('/refresh', validateRequest(refreshTokenSchema), asyncHandler(controller.refresh));
  router.post('/logout', authMiddleware, asyncHandler(controller.logout));
  router.get('/me', authMiddleware, asyncHandler(controller.me));

  return router;
}
