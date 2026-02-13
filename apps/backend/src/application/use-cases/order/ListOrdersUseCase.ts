import type { OrderStatus } from '@ecom/shared';
import type { OrderRepository } from '@/domain/order/repositories/OrderRepository';

interface Input {
  page: number;
  limit: number;
  status?: OrderStatus;
}

export class ListOrdersUseCase {
  constructor(private readonly orderRepository: OrderRepository) {}

  async execute(input: Input) {
    return this.orderRepository.list(input);
  }
}
