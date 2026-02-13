import { ORDER_STATUSES, type OrderStatus } from '@ecom/shared';

const validTransitions: Record<OrderStatus, OrderStatus[]> = {
  [ORDER_STATUSES.PENDING]: [ORDER_STATUSES.PAID, ORDER_STATUSES.CANCELLED],
  [ORDER_STATUSES.PAID]: [ORDER_STATUSES.SHIPPED, ORDER_STATUSES.CANCELLED],
  [ORDER_STATUSES.SHIPPED]: [ORDER_STATUSES.DELIVERED],
  [ORDER_STATUSES.DELIVERED]: [],
  [ORDER_STATUSES.CANCELLED]: []
};

export class OrderStatusVO {
  private readonly value: OrderStatus;

  constructor(value: OrderStatus) {
    this.value = value;
  }

  canTransitionTo(nextStatus: OrderStatus): boolean {
    return validTransitions[this.value].includes(nextStatus);
  }

  toString(): OrderStatus {
    return this.value;
  }
}
