import type { CustomerRepository } from '@/domain/customer/repositories/CustomerRepository';

interface Input {
  page: number;
  limit: number;
  search?: string;
}

export class ListCustomersUseCase {
  constructor(private readonly customerRepository: CustomerRepository) {}

  async execute(input: Input) {
    return this.customerRepository.list(input);
  }
}
