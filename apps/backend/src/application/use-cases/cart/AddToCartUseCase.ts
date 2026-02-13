import { Cart } from '@/domain/customer/entities/Cart';
import type { CartRepository } from '@/domain/customer/repositories/CartRepository';
import type { ProductRepository } from '@/domain/product/repositories/ProductRepository';
import { NotFoundError } from '@/shared/errors/NotFoundError';
import { ValidationError } from '@/shared/errors/ValidationError';

interface Input {
  customerId: string;
  productId: string;
  quantity: number;
}

export class AddToCartUseCase {
  constructor(
    private readonly cartRepository: CartRepository,
    private readonly productRepository: ProductRepository
  ) {}

  async execute(input: Input) {
    const product = await this.productRepository.findById(input.productId);

    if (!product) {
      throw new NotFoundError('Product not found');
    }

    if (input.quantity > product.stock) {
      throw new ValidationError('Requested quantity exceeds stock');
    }

    const cart = (await this.cartRepository.findByCustomerId(input.customerId)) ??
      new Cart({ customerId: input.customerId, items: [] });

    cart.addItem({
      productId: product.id!,
      name: product.name,
      price: product.price.toNumber(),
      quantity: input.quantity,
      imageUrl: product.imageUrl
    });

    return this.cartRepository.save(cart);
  }
}
