import { Product } from '../entities/Product';

export interface ProductSearchQuery {
  page: number;
  limit: number;
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
}

export interface ProductSearchResult {
  products: Product[];
  total: number;
}

export interface ProductRepository {
  create(product: Product): Promise<Product>;
  update(productId: string, updates: Partial<Product>): Promise<Product | null>;
  delete(productId: string): Promise<void>;
  findById(productId: string): Promise<Product | null>;
  search(query: ProductSearchQuery): Promise<ProductSearchResult>;
  findByIds(productIds: string[]): Promise<Product[]>;
}
