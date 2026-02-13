import { ORDER_STATUSES } from '@ecom/shared';
import { Order } from '@/domain/order/entities/Order';

describe('Order entity', () => {
  it('should allow valid status transitions', () => {
    const order = new Order({
      customerId: 'customer-id',
      items: [{ productId: 'product-id', name: 'Product', price: 10, quantity: 1 }],
      totalAmount: 10,
      status: ORDER_STATUSES.PENDING
    });

    order.updateStatus(ORDER_STATUSES.PAID);

    expect(order.status.toString()).toBe(ORDER_STATUSES.PAID);
  });

  it('should reject invalid status transitions', () => {
    const order = new Order({
      customerId: 'customer-id',
      items: [{ productId: 'product-id', name: 'Product', price: 10, quantity: 1 }],
      totalAmount: 10,
      status: ORDER_STATUSES.PENDING
    });

    expect(() => order.updateStatus(ORDER_STATUSES.DELIVERED)).toThrow();
  });
});
