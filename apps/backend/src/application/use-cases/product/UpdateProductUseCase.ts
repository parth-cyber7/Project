import { Money } from '@/domain/product/value-objects/Money';
import type { ProductRepository } from '@/domain/product/repositories/ProductRepository';
import { NotFoundError } from '@/shared/errors/NotFoundError';

interface Input {
  productId: string;
  name?: string;
  description?: string;
  price?: number;
  stock?: number;
  category?: string;
  imageUrl?: string;
}

export class UpdateProductUseCase {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute(input: Input) {
    const existingProduct = await this.productRepository.findById(input.productId);

    if (!existingProduct) {
      throw new NotFoundError('Product not found');
    }

    const updatedProduct = await this.productRepository.update(input.productId, {
      name: input.name,
      description: input.description,
      category: input.category,
      imageUrl: input.imageUrl,
      stock: input.stock,
      ...(input.price !== undefined ? { price: new Money(input.price) } : {})
    } as any);

    if (!updatedProduct) {
      throw new NotFoundError('Product not found');
    }

    return updatedProduct;
  }
}
