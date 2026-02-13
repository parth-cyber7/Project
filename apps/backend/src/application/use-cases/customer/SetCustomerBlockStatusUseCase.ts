import type { CustomerRepository } from '@/domain/customer/repositories/CustomerRepository';
import { NotFoundError } from '@/shared/errors/NotFoundError';

interface Input {
  customerId: string;
  isBlocked: boolean;
}

export class SetCustomerBlockStatusUseCase {
  constructor(private readonly customerRepository: CustomerRepository) {}

  async execute(input: Input) {
    const customer = await this.customerRepository.setBlockedStatus(input.customerId, input.isBlocked);

    if (!customer) {
      throw new NotFoundError('Customer not found');
    }

    return customer;
  }
}
