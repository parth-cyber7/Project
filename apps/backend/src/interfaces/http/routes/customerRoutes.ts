import { USER_ROLES } from '@ecom/shared';
import { Router } from 'express';
import type { AppContainer } from '@/infrastructure/container';
import { CustomerAdminController } from '@/interfaces/http/controllers/CustomerAdminController';
import { authMiddleware } from '@/interfaces/http/middlewares/authMiddleware';
import { roleMiddleware } from '@/interfaces/http/middlewares/roleMiddleware';
import { validateRequest } from '@/interfaces/http/middlewares/validateRequest';
import {
  customerOrdersSchema,
  listCustomersSchema,
  setCustomerBlockStatusSchema
} from '@/interfaces/http/validators/customerValidators';
import { asyncHandler } from '@/shared/utils/asyncHandler';

export function createCustomerRoutes(container: AppContainer): Router {
  const router = Router();
  const controller = new CustomerAdminController(container);

  router.use(authMiddleware, roleMiddleware([USER_ROLES.ADMIN]));

  router.get('/', validateRequest(listCustomersSchema), asyncHandler(controller.listCustomers));
  router.patch(
    '/:customerId/block-status',
    validateRequest(setCustomerBlockStatusSchema),
    asyncHandler(controller.setBlockedStatus)
  );
  router.get(
    '/:customerId/orders',
    validateRequest(customerOrdersSchema),
    asyncHandler(controller.getCustomerOrders)
  );

  return router;
}
