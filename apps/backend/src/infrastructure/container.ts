import { GetDashboardStatsUseCase } from '@/application/use-cases/admin/GetDashboardStatsUseCase';
import { AddToCartUseCase } from '@/application/use-cases/cart/AddToCartUseCase';
import { GetCartUseCase } from '@/application/use-cases/cart/GetCartUseCase';
import { RemoveFromCartUseCase } from '@/application/use-cases/cart/RemoveFromCartUseCase';
import { UpdateCartItemUseCase } from '@/application/use-cases/cart/UpdateCartItemUseCase';
import { GetCustomerOrdersByAdminUseCase } from '@/application/use-cases/customer/GetCustomerOrdersByAdminUseCase';
import { ListCustomersUseCase } from '@/application/use-cases/customer/ListCustomersUseCase';
import { SetCustomerBlockStatusUseCase } from '@/application/use-cases/customer/SetCustomerBlockStatusUseCase';
import { LoginUseCase } from '@/application/use-cases/auth/LoginUseCase';
import { LogoutUseCase } from '@/application/use-cases/auth/LogoutUseCase';
import { RefreshTokenUseCase } from '@/application/use-cases/auth/RefreshTokenUseCase';
import { RegisterCustomerUseCase } from '@/application/use-cases/auth/RegisterCustomerUseCase';
import { CreatePaymentIntentUseCase } from '@/application/use-cases/order/CreatePaymentIntentUseCase';
import { GetCustomerOrdersUseCase } from '@/application/use-cases/order/GetCustomerOrdersUseCase';
import { ListOrdersUseCase } from '@/application/use-cases/order/ListOrdersUseCase';
import { PlaceOrderUseCase } from '@/application/use-cases/order/PlaceOrderUseCase';
import { UpdateOrderStatusUseCase } from '@/application/use-cases/order/UpdateOrderStatusUseCase';
import { CreateProductUseCase } from '@/application/use-cases/product/CreateProductUseCase';
import { DeleteProductUseCase } from '@/application/use-cases/product/DeleteProductUseCase';
import { GetProductUseCase } from '@/application/use-cases/product/GetProductUseCase';
import { ListProductsUseCase } from '@/application/use-cases/product/ListProductsUseCase';
import { UpdateProductUseCase } from '@/application/use-cases/product/UpdateProductUseCase';
import { MongoAdminRepository } from '@/infrastructure/repositories/MongoAdminRepository';
import { MongoCartRepository } from '@/infrastructure/repositories/MongoCartRepository';
import { MongoCustomerRepository } from '@/infrastructure/repositories/MongoCustomerRepository';
import { MongoOrderRepository } from '@/infrastructure/repositories/MongoOrderRepository';
import { MongoProductRepository } from '@/infrastructure/repositories/MongoProductRepository';
import { EmailService } from '@/infrastructure/services/EmailService';
import { JwtService } from '@/infrastructure/services/JwtService';
import { PasswordHasher } from '@/infrastructure/services/PasswordHasher';
import { StripeService } from '@/infrastructure/services/StripeService';

export function createContainer() {
  const customerRepository = new MongoCustomerRepository();
  const productRepository = new MongoProductRepository();
  const cartRepository = new MongoCartRepository();
  const orderRepository = new MongoOrderRepository();
  const adminRepository = new MongoAdminRepository(orderRepository, customerRepository);

  const passwordHasher = new PasswordHasher();
  const jwtService = new JwtService();
  const emailService = new EmailService();
  const stripeService = new StripeService();

  return {
    repositories: {
      customerRepository,
      productRepository,
      cartRepository,
      orderRepository,
      adminRepository
    },
    services: {
      passwordHasher,
      jwtService,
      emailService,
      stripeService
    },
    useCases: {
      registerCustomer: new RegisterCustomerUseCase(customerRepository, passwordHasher),
      login: new LoginUseCase(customerRepository, passwordHasher, jwtService),
      refreshToken: new RefreshTokenUseCase(customerRepository, jwtService, passwordHasher),
      logout: new LogoutUseCase(customerRepository),
      createProduct: new CreateProductUseCase(productRepository),
      updateProduct: new UpdateProductUseCase(productRepository),
      deleteProduct: new DeleteProductUseCase(productRepository),
      listProducts: new ListProductsUseCase(productRepository),
      getProduct: new GetProductUseCase(productRepository),
      getCart: new GetCartUseCase(cartRepository),
      addToCart: new AddToCartUseCase(cartRepository, productRepository),
      updateCartItem: new UpdateCartItemUseCase(cartRepository, productRepository),
      removeFromCart: new RemoveFromCartUseCase(cartRepository),
      placeOrder: new PlaceOrderUseCase(
        cartRepository,
        orderRepository,
        productRepository,
        customerRepository,
        emailService
      ),
      getCustomerOrders: new GetCustomerOrdersUseCase(orderRepository),
      listOrders: new ListOrdersUseCase(orderRepository),
      updateOrderStatus: new UpdateOrderStatusUseCase(orderRepository),
      listCustomers: new ListCustomersUseCase(customerRepository),
      setCustomerBlockStatus: new SetCustomerBlockStatusUseCase(customerRepository),
      getCustomerOrdersByAdmin: new GetCustomerOrdersByAdminUseCase(orderRepository),
      getDashboardStats: new GetDashboardStatsUseCase(adminRepository),
      createPaymentIntent: new CreatePaymentIntentUseCase(stripeService)
    }
  };
}

export type AppContainer = ReturnType<typeof createContainer>;
