import { USER_ROLES } from '@ecom/shared';
import { Router } from 'express';
import type { AppContainer } from '@/infrastructure/container';
import { PaymentController } from '@/interfaces/http/controllers/PaymentController';
import { authMiddleware } from '@/interfaces/http/middlewares/authMiddleware';
import { roleMiddleware } from '@/interfaces/http/middlewares/roleMiddleware';
import { validateRequest } from '@/interfaces/http/middlewares/validateRequest';
import { createPaymentIntentSchema } from '@/interfaces/http/validators/paymentValidators';
import { asyncHandler } from '@/shared/utils/asyncHandler';

export function createPaymentRoutes(container: AppContainer): Router {
  const router = Router();
  const controller = new PaymentController(container);

  router.post(
    '/intent',
    authMiddleware,
    roleMiddleware([USER_ROLES.CUSTOMER]),
    validateRequest(createPaymentIntentSchema),
    asyncHandler(controller.createPaymentIntent)
  );

  return router;
}
