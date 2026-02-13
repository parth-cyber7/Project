import { USER_ROLES } from '@ecom/shared';
import { Router } from 'express';
import type { AppContainer } from '@/infrastructure/container';
import { CartController } from '@/interfaces/http/controllers/CartController';
import { authMiddleware } from '@/interfaces/http/middlewares/authMiddleware';
import { roleMiddleware } from '@/interfaces/http/middlewares/roleMiddleware';
import { validateRequest } from '@/interfaces/http/middlewares/validateRequest';
import {
  addToCartSchema,
  removeFromCartSchema,
  updateCartItemSchema
} from '@/interfaces/http/validators/cartValidators';
import { asyncHandler } from '@/shared/utils/asyncHandler';

export function createCartRoutes(container: AppContainer): Router {
  const router = Router();
  const controller = new CartController(container);

  router.use(authMiddleware, roleMiddleware([USER_ROLES.CUSTOMER]));

  router.get('/', asyncHandler(controller.getMyCart));
  router.post('/', validateRequest(addToCartSchema), asyncHandler(controller.addToCart));
  router.patch(
    '/:productId',
    validateRequest(updateCartItemSchema),
    asyncHandler(controller.updateCartItem)
  );
  router.delete(
    '/:productId',
    validateRequest(removeFromCartSchema),
    asyncHandler(controller.removeFromCart)
  );

  return router;
}
