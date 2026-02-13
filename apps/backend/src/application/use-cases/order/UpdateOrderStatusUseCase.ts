import type { OrderStatus } from '@ecom/shared';
import type { OrderRepository } from '@/domain/order/repositories/OrderRepository';
import { NotFoundError } from '@/shared/errors/NotFoundError';

interface Input {
  orderId: string;
  status: OrderStatus;
}

export class UpdateOrderStatusUseCase {
  constructor(private readonly orderRepository: OrderRepository) {}

  async execute(input: Input) {
    const existingOrder = await this.orderRepository.findById(input.orderId);

    if (!existingOrder) {
      throw new NotFoundError('Order not found');
    }

    existingOrder.updateStatus(input.status);

    const updatedOrder = await this.orderRepository.updateStatus(input.orderId, input.status);

    if (!updatedOrder) {
      throw new NotFoundError('Order not found');
    }

    return updatedOrder;
  }
}
