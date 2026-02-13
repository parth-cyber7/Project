import { ORDER_STATUSES, type OrderStatus } from '@ecom/shared';
import { OrderStatusVO } from '../value-objects/OrderStatus';

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
}

export interface OrderProps {
  id?: string;
  customerId: string;
  items: OrderItem[];
  totalAmount: number;
  status?: OrderStatus;
  createdAt?: Date;
}

export class Order {
  public readonly id?: string;
  public readonly customerId: string;
  public readonly items: OrderItem[];
  public totalAmount: number;
  public status: OrderStatusVO;
  public readonly createdAt: Date;

  constructor(props: OrderProps) {
    this.id = props.id;
    this.customerId = props.customerId;
    this.items = props.items;
    this.totalAmount = Number(props.totalAmount.toFixed(2));
    this.status = new OrderStatusVO(props.status ?? ORDER_STATUSES.PENDING);
    this.createdAt = props.createdAt ?? new Date();

    if (!this.items.length) {
      throw new Error('Order must contain at least one item');
    }

    if (this.totalAmount <= 0) {
      throw new Error('Order total amount must be greater than 0');
    }
  }

  updateStatus(nextStatus: OrderStatus): void {
    if (!this.status.canTransitionTo(nextStatus)) {
      throw new Error(`Invalid status transition from ${this.status.toString()} to ${nextStatus}`);
    }

    this.status = new OrderStatusVO(nextStatus);
  }
}
