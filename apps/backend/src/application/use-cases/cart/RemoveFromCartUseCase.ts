import type { CartRepository } from '@/domain/customer/repositories/CartRepository';
import { NotFoundError } from '@/shared/errors/NotFoundError';

interface Input {
  customerId: string;
  productId: string;
}

export class RemoveFromCartUseCase {
  constructor(private readonly cartRepository: CartRepository) {}

  async execute(input: Input) {
    const cart = await this.cartRepository.findByCustomerId(input.customerId);

    if (!cart) {
      throw new NotFoundError('Cart not found');
    }

    cart.removeItem(input.productId);
    return this.cartRepository.save(cart);
  }
}
