import { USER_ROLES } from '@ecom/shared';
import { Customer } from '@/domain/customer/entities/Customer';
import type { CustomerRepository } from '@/domain/customer/repositories/CustomerRepository';
import type { PasswordHasher } from '@/infrastructure/services/PasswordHasher';
import { AppError } from '@/shared/errors/AppError';

interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

export class RegisterCustomerUseCase {
  constructor(
    private readonly customerRepository: CustomerRepository,
    private readonly passwordHasher: PasswordHasher
  ) {}

  async execute(input: RegisterInput): Promise<Customer> {
    const existing = await this.customerRepository.findByEmail(input.email);
    if (existing) {
      throw new AppError('Email already registered', 409, 'EMAIL_EXISTS');
    }

    const passwordHash = await this.passwordHasher.hash(input.password);

    const customer = new Customer({
      name: input.name,
      email: input.email,
      passwordHash,
      role: USER_ROLES.CUSTOMER,
      isBlocked: false
    });

    return this.customerRepository.create(customer);
  }
}
