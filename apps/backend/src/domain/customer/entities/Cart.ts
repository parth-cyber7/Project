export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
}

export interface CartProps {
  id?: string;
  customerId: string;
  items?: CartItem[];
  updatedAt?: Date;
}

export class Cart {
  public readonly id?: string;
  public readonly customerId: string;
  public items: CartItem[];
  public updatedAt: Date;

  constructor(props: CartProps) {
    this.id = props.id;
    this.customerId = props.customerId;
    this.items = props.items ?? [];
    this.updatedAt = props.updatedAt ?? new Date();
  }

  addItem(item: CartItem): void {
    if (item.quantity <= 0) {
      throw new Error('Quantity should be greater than 0');
    }

    const existingItem = this.items.find((cartItem) => cartItem.productId === item.productId);

    if (existingItem) {
      existingItem.quantity += item.quantity;
    } else {
      this.items.push(item);
    }

    this.updatedAt = new Date();
  }

  updateQuantity(productId: string, quantity: number): void {
    if (quantity < 0) {
      throw new Error('Quantity cannot be negative');
    }

    const item = this.items.find((cartItem) => cartItem.productId === productId);
    if (!item) {
      throw new Error('Cart item not found');
    }

    if (quantity === 0) {
      this.removeItem(productId);
      return;
    }

    item.quantity = quantity;
    this.updatedAt = new Date();
  }

  removeItem(productId: string): void {
    this.items = this.items.filter((item) => item.productId !== productId);
    this.updatedAt = new Date();
  }

  clear(): void {
    this.items = [];
    this.updatedAt = new Date();
  }

  getTotalAmount(): number {
    return this.items.reduce((total, item) => total + item.price * item.quantity, 0);
  }
}
