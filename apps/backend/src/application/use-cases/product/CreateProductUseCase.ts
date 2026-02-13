import { Product } from '@/domain/product/entities/Product';
import type { ProductRepository } from '@/domain/product/repositories/ProductRepository';

interface Input {
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  imageUrl?: string;
}

export class CreateProductUseCase {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute(input: Input): Promise<Product> {
    const product = new Product(input);
    return this.productRepository.create(product);
  }
}
