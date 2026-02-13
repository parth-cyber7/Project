import type { CartRepository } from '@/domain/customer/repositories/CartRepository';
import type { ProductRepository } from '@/domain/product/repositories/ProductRepository';
import { NotFoundError } from '@/shared/errors/NotFoundError';
import { ValidationError } from '@/shared/errors/ValidationError';

interface Input {
  customerId: string;
  productId: string;
  quantity: number;
}

export class UpdateCartItemUseCase {
  constructor(
    private readonly cartRepository: CartRepository,
    private readonly productRepository: ProductRepository
  ) {}

  async execute(input: Input) {
    const cart = await this.cartRepository.findByCustomerId(input.customerId);

    if (!cart) {
      throw new NotFoundError('Cart not found');
    }

    const product = await this.productRepository.findById(input.productId);

    if (!product) {
      throw new NotFoundError('Product not found');
    }

    if (input.quantity > product.stock) {
      throw new ValidationError('Requested quantity exceeds stock');
    }

    cart.updateQuantity(input.productId, input.quantity);
    return this.cartRepository.save(cart);
  }
}
