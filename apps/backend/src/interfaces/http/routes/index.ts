import { Router } from 'express';
import type { AppContainer } from '@/infrastructure/container';
import { createAdminRoutes } from './adminRoutes';
import { createAuthRoutes } from './authRoutes';
import { createCartRoutes } from './cartRoutes';
import { createCustomerRoutes } from './customerRoutes';
import { createOrderRoutes } from './orderRoutes';
import { createPaymentRoutes } from './paymentRoutes';
import { createProductRoutes } from './productRoutes';

export function createApiRoutes(container: AppContainer): Router {
  const router = Router();

  router.use('/auth', createAuthRoutes(container));
  router.use('/products', createProductRoutes(container));
  router.use('/cart', createCartRoutes(container));
  router.use('/orders', createOrderRoutes(container));
  router.use('/customers', createCustomerRoutes(container));
  router.use('/admin', createAdminRoutes(container));
  router.use('/payments', createPaymentRoutes(container));

  return router;
}
