import { Product } from '@/domain/product/entities/Product';

describe('Product entity', () => {
  it('should reduce stock when quantity is valid', () => {
    const product = new Product({
      name: 'Product A',
      description: 'Description',
      price: 10,
      stock: 5,
      category: 'Category'
    });

    product.reduceStock(2);

    expect(product.stock).toBe(3);
  });

  it('should throw when reducing stock beyond available quantity', () => {
    const product = new Product({
      name: 'Product A',
      description: 'Description',
      price: 10,
      stock: 5,
      category: 'Category'
    });

    expect(() => product.reduceStock(6)).toThrow('Insufficient stock');
  });
});
