import { Money } from '../value-objects/Money';

export interface ProductProps {
  id?: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  imageUrl?: string;
  createdAt?: Date;
}

export class Product {
  public readonly id?: string;
  public name: string;
  public description: string;
  public price: Money;
  public stock: number;
  public category: string;
  public imageUrl?: string;
  public readonly createdAt: Date;

  constructor(props: ProductProps) {
    this.id = props.id;
    this.name = props.name.trim();
    this.description = props.description.trim();
    this.price = new Money(props.price);
    this.stock = props.stock;
    this.category = props.category.trim();
    this.imageUrl = props.imageUrl;
    this.createdAt = props.createdAt ?? new Date();

    if (!this.name) {
      throw new Error('Product name is required');
    }

    if (this.stock < 0) {
      throw new Error('Product stock cannot be negative');
    }

    if (!this.category) {
      throw new Error('Category is required');
    }
  }

  updateStock(stock: number): void {
    if (stock < 0) {
      throw new Error('Stock cannot be negative');
    }

    this.stock = stock;
  }

  reduceStock(quantity: number): void {
    if (quantity <= 0) {
      throw new Error('Quantity must be greater than zero');
    }

    if (this.stock < quantity) {
      throw new Error(`Insufficient stock for product ${this.name}`);
    }

    this.stock -= quantity;
  }
}
