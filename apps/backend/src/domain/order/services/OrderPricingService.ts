import type { OrderItem } from '../entities/Order';

export class OrderPricingService {
  static calculateTotal(items: OrderItem[]): number {
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    return Number(total.toFixed(2));
  }
}
