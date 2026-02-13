import { USER_ROLES } from '@ecom/shared';
import { Router } from 'express';
import type { AppContainer } from '@/infrastructure/container';
import { ProductController } from '@/interfaces/http/controllers/ProductController';
import { authMiddleware } from '@/interfaces/http/middlewares/authMiddleware';
import { roleMiddleware } from '@/interfaces/http/middlewares/roleMiddleware';
import { upload } from '@/interfaces/http/middlewares/uploadMiddleware';
import { validateRequest } from '@/interfaces/http/middlewares/validateRequest';
import {
  createProductSchema,
  getProductSchema,
  listProductsSchema,
  updateProductSchema
} from '@/interfaces/http/validators/productValidators';
import { asyncHandler } from '@/shared/utils/asyncHandler';

export function createProductRoutes(container: AppContainer): Router {
  const router = Router();
  const controller = new ProductController(container);

  router.get('/', validateRequest(listProductsSchema), asyncHandler(controller.list));
  router.get('/:productId', validateRequest(getProductSchema), asyncHandler(controller.getById));

  router.post(
    '/',
    authMiddleware,
    roleMiddleware([USER_ROLES.ADMIN]),
    validateRequest(createProductSchema),
    asyncHandler(controller.create)
  );

  router.patch(
    '/:productId',
    authMiddleware,
    roleMiddleware([USER_ROLES.ADMIN]),
    validateRequest(updateProductSchema),
    asyncHandler(controller.update)
  );

  router.delete(
    '/:productId',
    authMiddleware,
    roleMiddleware([USER_ROLES.ADMIN]),
    validateRequest(getProductSchema),
    asyncHandler(controller.delete)
  );

  router.post(
    '/upload-image',
    authMiddleware,
    roleMiddleware([USER_ROLES.ADMIN]),
    upload.single('image'),
    asyncHandler(controller.uploadImage)
  );

  return router;
}
