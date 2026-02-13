import { type OrderStatus } from '@ecom/shared';
import { Order } from '../entities/Order';

export interface OrderListQuery {
  page: number;
  limit: number;
  status?: OrderStatus;
}

export interface OrderListResult {
  orders: Order[];
  total: number;
}

export interface MonthlySalesPoint {
  month: string;
  revenue: number;
  orders: number;
}

export interface TopSellingProduct {
  productId: string;
  name: string;
  quantitySold: number;
  revenue: number;
}

export interface OrderRepository {
  create(order: Order): Promise<Order>;
  findById(orderId: string): Promise<Order | null>;
  findByCustomerId(customerId: string, query: OrderListQuery): Promise<OrderListResult>;
  list(query: OrderListQuery): Promise<OrderListResult>;
  updateStatus(orderId: string, status: OrderStatus): Promise<Order | null>;
  getTotalRevenue(): Promise<number>;
  getMonthlySales(lastNMonths: number): Promise<MonthlySalesPoint[]>;
  getTopSellingProducts(limit: number): Promise<TopSellingProduct[]>;
  getRecentOrders(limit: number): Promise<Order[]>;
  getTotalOrders(): Promise<number>;
}
