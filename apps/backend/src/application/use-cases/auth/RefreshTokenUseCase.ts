import type { CustomerRepository } from '@/domain/customer/repositories/CustomerRepository';
import type { JwtService } from '@/infrastructure/services/JwtService';
import type { PasswordHasher } from '@/infrastructure/services/PasswordHasher';
import { UnauthorizedError } from '@/shared/errors/UnauthorizedError';

interface RefreshResult {
  accessToken: string;
  refreshToken: string;
}

export class RefreshTokenUseCase {
  constructor(
    private readonly customerRepository: CustomerRepository,
    private readonly jwtService: JwtService,
    private readonly passwordHasher: PasswordHasher
  ) {}

  async execute(refreshToken: string): Promise<RefreshResult> {
    let payload;

    try {
      payload = this.jwtService.verifyRefreshToken(refreshToken);
    } catch {
      throw new UnauthorizedError('Invalid refresh token');
    }

    const customer = await this.customerRepository.findById(payload.sub);

    if (!customer || !customer.refreshTokenHash) {
      throw new UnauthorizedError('Invalid refresh token');
    }

    const isValidRefreshToken = await this.passwordHasher.compare(
      refreshToken,
      customer.refreshTokenHash
    );

    if (!isValidRefreshToken) {
      throw new UnauthorizedError('Invalid refresh token');
    }

    const nextPayload = {
      sub: customer.id!,
      role: customer.role,
      email: customer.email.toString()
    };

    const newAccessToken = this.jwtService.signAccessToken(nextPayload);
    const newRefreshToken = this.jwtService.signRefreshToken(nextPayload);

    const newRefreshTokenHash = await this.passwordHasher.hash(newRefreshToken);
    await this.customerRepository.saveRefreshTokenHash(customer.id!, newRefreshTokenHash);

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken
    };
  }
}
