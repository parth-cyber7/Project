import type { MonthlySalesPoint, TopSellingProduct } from '../../order/repositories/OrderRepository';
import type { Order } from '../../order/entities/Order';

export interface AdminDashboard {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  monthlySales: MonthlySalesPoint[];
  topSellingProducts: TopSellingProduct[];
  recentOrders: Order[];
}
