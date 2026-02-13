import { Cart } from '@/domain/customer/entities/Cart';
import type { CartRepository } from '@/domain/customer/repositories/CartRepository';

export class GetCartUseCase {
  constructor(private readonly cartRepository: CartRepository) {}

  async execute(customerId: string): Promise<Cart> {
    const cart = await this.cartRepository.findByCustomerId(customerId);
    return cart ?? new Cart({ customerId, items: [] });
  }
}
