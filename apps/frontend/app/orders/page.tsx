'use client';

import { useEffect, useState } from 'react';
import { AuthGuard } from '@/components/AuthGuard';
import api from '@/lib/api';
import { formatCurrency, formatDate } from '@/lib/format';
import type { ApiResponse, Order } from '@/types';

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const loadOrders = async () => {
      const response = await api.get<ApiResponse<Order[]>>('/orders/mine?page=1&limit=20');
      setOrders(response.data.data);
    };

    void loadOrders();
  }, []);

  return (
    <AuthGuard requiredRole="customer">
      <div className="space-y-5">
        <h1 className="text-3xl font-bold tracking-tight">Order History</h1>

        {orders.length === 0 ? (
          <p className="text-slate-600">No orders found.</p>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <article key={order.id} className="rounded-xl border border-slate-200 bg-white p-5 shadow-card">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h2 className="font-semibold text-slate-900">Order #{order.id.slice(-8)}</h2>
                  <span className="rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold uppercase text-brand-800">
                    {order.status}
                  </span>
                </div>

                <p className="mt-2 text-sm text-slate-500">{formatDate(order.createdAt)}</p>

                <div className="mt-3 space-y-1 text-sm text-slate-700">
                  {order.items.map((item) => (
                    <p key={`${order.id}-${item.productId}`}>
                      {item.name} x {item.quantity}
                    </p>
                  ))}
                </div>

                <p className="mt-3 font-semibold">Total: {formatCurrency(order.totalAmount)}</p>
              </article>
            ))}
          </div>
        )}
      </div>
    </AuthGuard>
  );
}
