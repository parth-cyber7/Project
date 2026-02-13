import { ORDER_STATUSES } from '@ecom/shared';
import { Order } from '@/domain/order/entities/Order';
import type { CartRepository } from '@/domain/customer/repositories/CartRepository';
import type { CustomerRepository } from '@/domain/customer/repositories/CustomerRepository';
import type { OrderRepository } from '@/domain/order/repositories/OrderRepository';
import type { ProductRepository } from '@/domain/product/repositories/ProductRepository';
import { OrderPricingService } from '@/domain/order/services/OrderPricingService';
import type { EmailService } from '@/infrastructure/services/EmailService';
import { NotFoundError } from '@/shared/errors/NotFoundError';
import { ValidationError } from '@/shared/errors/ValidationError';

export class PlaceOrderUseCase {
  constructor(
    private readonly cartRepository: CartRepository,
    private readonly orderRepository: OrderRepository,
    private readonly productRepository: ProductRepository,
    private readonly customerRepository: CustomerRepository,
    private readonly emailService: EmailService
  ) {}

  async execute(customerId: string): Promise<Order> {
    const customer = await this.customerRepository.findById(customerId);
    if (!customer) {
      throw new NotFoundError('Customer not found');
    }

    if (customer.isBlocked) {
      throw new ValidationError('Blocked customers cannot place orders');
    }

    const cart = await this.cartRepository.findByCustomerId(customerId);

    if (!cart || !cart.items.length) {
      throw new ValidationError('Cart is empty');
    }

    const products = await this.productRepository.findByIds(cart.items.map((item) => item.productId));
    const productById = new Map(products.map((product) => [product.id!, product]));

    for (const item of cart.items) {
      const product = productById.get(item.productId);

      if (!product) {
        throw new ValidationError(`Product ${item.productId} no longer exists`);
      }

      if (item.quantity > product.stock) {
        throw new ValidationError(`Insufficient stock for ${product.name}`);
      }
    }

    for (const item of cart.items) {
      const product = productById.get(item.productId)!;
      await this.productRepository.update(product.id!, { stock: product.stock - item.quantity } as any);
    }

    const orderItems = cart.items.map((item) => ({ ...item }));
    const totalAmount = OrderPricingService.calculateTotal(orderItems);

    const order = new Order({
      customerId,
      items: orderItems,
      totalAmount,
      status: ORDER_STATUSES.PENDING
    });

    const createdOrder = await this.orderRepository.create(order);

    await this.cartRepository.clearByCustomerId(customerId);
    await this.emailService.sendOrderConfirmation(customer.email.toString(), createdOrder.id!, totalAmount);

    return createdOrder;
  }
}
