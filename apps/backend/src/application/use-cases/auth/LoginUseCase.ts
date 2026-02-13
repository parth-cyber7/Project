import type { Customer } from '@/domain/customer/entities/Customer';
import type { CustomerRepository } from '@/domain/customer/repositories/CustomerRepository';
import type { JwtService } from '@/infrastructure/services/JwtService';
import type { PasswordHasher } from '@/infrastructure/services/PasswordHasher';
import { UnauthorizedError } from '@/shared/errors/UnauthorizedError';

interface LoginInput {
  email: string;
  password: string;
}

interface LoginResult {
  accessToken: string;
  refreshToken: string;
  customer: Customer;
}

export class LoginUseCase {
  constructor(
    private readonly customerRepository: CustomerRepository,
    private readonly passwordHasher: PasswordHasher,
    private readonly jwtService: JwtService
  ) {}

  async execute(input: LoginInput): Promise<LoginResult> {
    const customer = await this.customerRepository.findByEmail(input.email);

    if (!customer) {
      throw new UnauthorizedError('Invalid credentials');
    }

    if (customer.isBlocked) {
      throw new UnauthorizedError('Your account has been blocked. Contact support');
    }

    const isValidPassword = await this.passwordHasher.compare(input.password, customer.passwordHash);

    if (!isValidPassword) {
      throw new UnauthorizedError('Invalid credentials');
    }

    const payload = {
      sub: customer.id!,
      role: customer.role,
      email: customer.email.toString()
    };

    const accessToken = this.jwtService.signAccessToken(payload);
    const refreshToken = this.jwtService.signRefreshToken(payload);
    const refreshTokenHash = await this.passwordHasher.hash(refreshToken);

    await this.customerRepository.saveRefreshTokenHash(customer.id!, refreshTokenHash);

    return {
      accessToken,
      refreshToken,
      customer
    };
  }
}
