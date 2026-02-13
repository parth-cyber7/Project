import type { CustomerRepository } from '@/domain/customer/repositories/CustomerRepository';

export class LogoutUseCase {
  constructor(private readonly customerRepository: CustomerRepository) {}

  async execute(customerId: string): Promise<void> {
    await this.customerRepository.saveRefreshTokenHash(customerId, null);
  }
}
