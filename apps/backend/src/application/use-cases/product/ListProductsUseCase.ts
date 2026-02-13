import type {
  ProductRepository,
  ProductSearchQuery
} from '@/domain/product/repositories/ProductRepository';

export class ListProductsUseCase {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute(query: ProductSearchQuery) {
    return this.productRepository.search(query);
  }
}
