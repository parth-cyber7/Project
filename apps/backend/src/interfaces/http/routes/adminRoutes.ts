import { USER_ROLES } from '@ecom/shared';
import { Router } from 'express';
import type { AppContainer } from '@/infrastructure/container';
import { AdminController } from '@/interfaces/http/controllers/AdminController';
import { authMiddleware } from '@/interfaces/http/middlewares/authMiddleware';
import { roleMiddleware } from '@/interfaces/http/middlewares/roleMiddleware';
import { asyncHandler } from '@/shared/utils/asyncHandler';

export function createAdminRoutes(container: AppContainer): Router {
  const router = Router();
  const controller = new AdminController(container);

  router.get(
    '/dashboard',
    authMiddleware,
    roleMiddleware([USER_ROLES.ADMIN]),
    asyncHandler(controller.dashboard)
  );

  return router;
}
