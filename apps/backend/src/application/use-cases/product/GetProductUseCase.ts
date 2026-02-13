import type { ProductRepository } from '@/domain/product/repositories/ProductRepository';
import { NotFoundError } from '@/shared/errors/NotFoundError';

export class GetProductUseCase {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute(productId: string) {
    const product = await this.productRepository.findById(productId);

    if (!product) {
      throw new NotFoundError('Product not found');
    }

    return product;
  }
}
