import { Product } from '@/domain/product/entities/Product';
import {
  type ProductRepository,
  type ProductSearchQuery,
  type ProductSearchResult
} from '@/domain/product/repositories/ProductRepository';
import { ProductModel } from '@/infrastructure/database/mongoose/models/ProductModel';
import { getPagination } from '@/shared/utils/pagination';

function toEntity(doc: any): Product {
  return new Product({
    id: doc._id.toString(),
    name: doc.name,
    description: doc.description,
    price: doc.price,
    stock: doc.stock,
    category: doc.category,
    imageUrl: doc.imageUrl,
    createdAt: doc.createdAt
  });
}

function mapProductUpdates(updates: Partial<Product>): Record<string, unknown> {
  const payload: Record<string, unknown> = {};

  if (updates.name !== undefined) payload.name = updates.name;
  if (updates.description !== undefined) payload.description = updates.description;
  if (updates.category !== undefined) payload.category = updates.category;
  if (updates.imageUrl !== undefined) payload.imageUrl = updates.imageUrl;
  if (updates.stock !== undefined) payload.stock = updates.stock;
  if (updates.price !== undefined) payload.price = updates.price.toNumber();

  return payload;
}

export class MongoProductRepository implements ProductRepository {
  async create(product: Product): Promise<Product> {
    const created = await ProductModel.create({
      name: product.name,
      description: product.description,
      price: product.price.toNumber(),
      stock: product.stock,
      category: product.category,
      imageUrl: product.imageUrl
    });

    return toEntity(created);
  }

  async update(productId: string, updates: Partial<Product>): Promise<Product | null> {
    const updated = await ProductModel.findByIdAndUpdate(productId, mapProductUpdates(updates), {
      new: true
    }).lean();

    return updated ? toEntity(updated) : null;
  }

  async delete(productId: string): Promise<void> {
    await ProductModel.findByIdAndDelete(productId).exec();
  }

  async findById(productId: string): Promise<Product | null> {
    const product = await ProductModel.findById(productId).lean();
    return product ? toEntity(product) : null;
  }

  async search(query: ProductSearchQuery): Promise<ProductSearchResult> {
    const { page, limit, skip } = getPagination(query.page, query.limit);

    const filter: Record<string, unknown> = {};

    if (query.search) {
      filter.$or = [
        { name: { $regex: query.search, $options: 'i' } },
        { description: { $regex: query.search, $options: 'i' } }
      ];
    }

    if (query.category) {
      filter.category = query.category;
    }

    if (query.minPrice !== undefined || query.maxPrice !== undefined) {
      filter.price = {};
      if (query.minPrice !== undefined) {
        (filter.price as Record<string, number>).$gte = query.minPrice;
      }
      if (query.maxPrice !== undefined) {
        (filter.price as Record<string, number>).$lte = query.maxPrice;
      }
    }

    const [products, total] = await Promise.all([
      ProductModel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      ProductModel.countDocuments(filter)
    ]);

    return {
      products: products.map(toEntity),
      total
    };
  }

  async findByIds(productIds: string[]): Promise<Product[]> {
    const products = await ProductModel.find({ _id: { $in: productIds } }).lean();
    return products.map(toEntity);
  }
}
