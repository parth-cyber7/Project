import type { AdminDashboard } from '@/domain/admin/entities/AdminDashboard';
import type { AdminRepository } from '@/domain/admin/repositories/AdminRepository';
import type { CustomerRepository } from '@/domain/customer/repositories/CustomerRepository';
import type { OrderRepository } from '@/domain/order/repositories/OrderRepository';

export class MongoAdminRepository implements AdminRepository {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly customerRepository: CustomerRepository
  ) {}

  async getDashboardStats(): Promise<AdminDashboard> {
    const [totalRevenue, totalOrders, customerData, monthlySales, topSellingProducts, recentOrders] =
      await Promise.all([
        this.orderRepository.getTotalRevenue(),
        this.orderRepository.getTotalOrders(),
        this.customerRepository.list({ page: 1, limit: 1 }),
        this.orderRepository.getMonthlySales(12),
        this.orderRepository.getTopSellingProducts(5),
        this.orderRepository.getRecentOrders(10)
      ]);

    return {
      totalRevenue,
      totalOrders,
      totalCustomers: customerData.total,
      monthlySales,
      topSellingProducts,
      recentOrders
    };
  }
}
