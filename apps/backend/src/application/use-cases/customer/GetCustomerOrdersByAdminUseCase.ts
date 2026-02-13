import type { OrderRepository } from '@/domain/order/repositories/OrderRepository';

interface Input {
  customerId: string;
  page: number;
  limit: number;
}

export class GetCustomerOrdersByAdminUseCase {
  constructor(private readonly orderRepository: OrderRepository) {}

  async execute(input: Input) {
    return this.orderRepository.findByCustomerId(input.customerId, {
      page: input.page,
      limit: input.limit
    });
  }
}
