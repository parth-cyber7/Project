import type { ProductRepository } from '@/domain/product/repositories/ProductRepository';
import { NotFoundError } from '@/shared/errors/NotFoundError';

export class DeleteProductUseCase {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute(productId: string): Promise<void> {
    const existingProduct = await this.productRepository.findById(productId);

    if (!existingProduct) {
      throw new NotFoundError('Product not found');
    }

    await this.productRepository.delete(productId);
  }
}
