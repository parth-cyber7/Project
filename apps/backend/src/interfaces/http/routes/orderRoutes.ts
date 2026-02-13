import { USER_ROLES } from '@ecom/shared';
import { Router } from 'express';
import type { AppContainer } from '@/infrastructure/container';
import { OrderController } from '@/interfaces/http/controllers/OrderController';
import { authMiddleware } from '@/interfaces/http/middlewares/authMiddleware';
import { roleMiddleware } from '@/interfaces/http/middlewares/roleMiddleware';
import { validateRequest } from '@/interfaces/http/middlewares/validateRequest';
import { listOrdersSchema, updateOrderStatusSchema } from '@/interfaces/http/validators/orderValidators';
import { asyncHandler } from '@/shared/utils/asyncHandler';

export function createOrderRoutes(container: AppContainer): Router {
  const router = Router();
  const controller = new OrderController(container);

  router.post(
    '/',
    authMiddleware,
    roleMiddleware([USER_ROLES.CUSTOMER]),
    asyncHandler(controller.placeOrder)
  );

  router.get(
    '/mine',
    authMiddleware,
    roleMiddleware([USER_ROLES.CUSTOMER]),
    validateRequest(listOrdersSchema),
    asyncHandler(controller.getMyOrders)
  );

  router.get(
    '/',
    authMiddleware,
    roleMiddleware([USER_ROLES.ADMIN]),
    validateRequest(listOrdersSchema),
    asyncHandler(controller.listOrders)
  );

  router.patch(
    '/:orderId/status',
    authMiddleware,
    roleMiddleware([USER_ROLES.ADMIN]),
    validateRequest(updateOrderStatusSchema),
    asyncHandler(controller.updateOrderStatus)
  );

  return router;
}
