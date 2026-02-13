import { ORDER_STATUSES, type OrderStatus } from '@ecom/shared';
import { Order } from '@/domain/order/entities/Order';
import {
  type MonthlySalesPoint,
  type OrderListQuery,
  type OrderListResult,
  type OrderRepository,
  type TopSellingProduct
} from '@/domain/order/repositories/OrderRepository';
import { OrderModel } from '@/infrastructure/database/mongoose/models/OrderModel';
import { getPagination } from '@/shared/utils/pagination';

function toEntity(doc: any): Order {
  return new Order({
    id: doc._id.toString(),
    customerId: doc.customerId.toString(),
    items: doc.items.map((item: any) => ({
      productId: item.productId.toString(),
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      imageUrl: item.imageUrl
    })),
    totalAmount: doc.totalAmount,
    status: doc.status,
    createdAt: doc.createdAt
  });
}

export class MongoOrderRepository implements OrderRepository {
  async create(order: Order): Promise<Order> {
    const created = await OrderModel.create({
      customerId: order.customerId,
      items: order.items.map((item) => ({
        productId: item.productId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        imageUrl: item.imageUrl
      })),
      totalAmount: order.totalAmount,
      status: order.status.toString()
    });

    return toEntity(created);
  }

  async findById(orderId: string): Promise<Order | null> {
    const order = await OrderModel.findById(orderId).lean();
    return order ? toEntity(order) : null;
  }

  async findByCustomerId(customerId: string, query: OrderListQuery): Promise<OrderListResult> {
    const { limit, skip } = getPagination(query.page, query.limit);

    const filter: Record<string, unknown> = { customerId };
    if (query.status) {
      filter.status = query.status;
    }

    const [orders, total] = await Promise.all([
      OrderModel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      OrderModel.countDocuments(filter)
    ]);

    return {
      orders: orders.map(toEntity),
      total
    };
  }

  async list(query: OrderListQuery): Promise<OrderListResult> {
    const { limit, skip } = getPagination(query.page, query.limit);

    const filter: Record<string, unknown> = {};
    if (query.status) {
      filter.status = query.status;
    }

    const [orders, total] = await Promise.all([
      OrderModel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      OrderModel.countDocuments(filter)
    ]);

    return {
      orders: orders.map(toEntity),
      total
    };
  }

  async updateStatus(orderId: string, status: OrderStatus): Promise<Order | null> {
    const order = await OrderModel.findByIdAndUpdate(orderId, { status }, { new: true }).lean();
    return order ? toEntity(order) : null;
  }

  async getTotalRevenue(): Promise<number> {
    const result = await OrderModel.aggregate([
      { $match: { status: { $in: [ORDER_STATUSES.PAID, ORDER_STATUSES.SHIPPED, ORDER_STATUSES.DELIVERED] } } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);

    return result[0]?.total ?? 0;
  }

  async getMonthlySales(lastNMonths: number): Promise<MonthlySalesPoint[]> {
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - (lastNMonths - 1));
    startDate.setDate(1);
    startDate.setHours(0, 0, 0, 0);

    const data = await OrderModel.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
          status: { $in: [ORDER_STATUSES.PAID, ORDER_STATUSES.SHIPPED, ORDER_STATUSES.DELIVERED] }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          revenue: { $sum: '$totalAmount' },
          orders: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    return data.map((point) => ({
      month: `${point._id.year}-${String(point._id.month).padStart(2, '0')}`,
      revenue: Number(point.revenue.toFixed(2)),
      orders: point.orders
    }));
  }

  async getTopSellingProducts(limit: number): Promise<TopSellingProduct[]> {
    const data = await OrderModel.aggregate([
      { $match: { status: { $in: [ORDER_STATUSES.PAID, ORDER_STATUSES.SHIPPED, ORDER_STATUSES.DELIVERED] } } },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.productId',
          name: { $first: '$items.name' },
          quantitySold: { $sum: '$items.quantity' },
          revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } }
        }
      },
      { $sort: { quantitySold: -1 } },
      { $limit: limit }
    ]);

    return data.map((item) => ({
      productId: item._id.toString(),
      name: item.name,
      quantitySold: item.quantitySold,
      revenue: Number(item.revenue.toFixed(2))
    }));
  }

  async getRecentOrders(limit: number): Promise<Order[]> {
    const orders = await OrderModel.find().sort({ createdAt: -1 }).limit(limit).lean();
    return orders.map(toEntity);
  }

  async getTotalOrders(): Promise<number> {
    return OrderModel.countDocuments();
  }
}
