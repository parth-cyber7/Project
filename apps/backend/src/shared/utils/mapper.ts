import type { Customer } from '@/domain/customer/entities/Customer';
import type { Product } from '@/domain/product/entities/Product';
import type { Order } from '@/domain/order/entities/Order';

export function customerToPlain(customer: Customer) {
  return {
    id: customer.id,
    name: customer.name,
    email: customer.email.toString(),
    role: customer.role,
    isBlocked: customer.isBlocked,
    createdAt: customer.createdAt
  };
}

export function productToPlain(product: Product) {
  return {
    id: product.id,
    name: product.name,
    description: product.description,
    price: product.price.toNumber(),
    stock: product.stock,
    category: product.category,
    imageUrl: product.imageUrl,
    createdAt: product.createdAt
  };
}

export function orderToPlain(order: Order) {
  return {
    id: order.id,
    customerId: order.customerId,
    items: order.items,
    totalAmount: order.totalAmount,
    status: order.status.toString(),
    createdAt: order.createdAt
  };
}
