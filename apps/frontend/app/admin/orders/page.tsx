'use client';

import { ORDER_STATUSES } from '@ecom/shared';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { formatCurrency, formatDate } from '@/lib/format';
import type { ApiResponse, Order } from '@/types';

const statuses = Object.values(ORDER_STATUSES);

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filterStatus, setFilterStatus] = useState('');

  const loadOrders = async () => {
    const query = filterStatus ? `?status=${filterStatus}&page=1&limit=50` : '?page=1&limit=50';
    const response = await api.get<ApiResponse<Order[]>>(`/orders${query}`);
    setOrders(response.data.data);
  };

  useEffect(() => {
    void loadOrders();
  }, [filterStatus]);

  const updateStatus = async (orderId: string, status: string) => {
    await api.patch(`/orders/${orderId}/status`, { status });
    await loadOrders();
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Manage Orders</h1>
        <select value={filterStatus} onChange={(event) => setFilterStatus(event.target.value)} className="w-56">
          <option value="">All Statuses</option>
          {statuses.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white p-4 shadow-card">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="text-slate-500">
              <th className="px-2 py-2">Order</th>
              <th className="px-2 py-2">Total</th>
              <th className="px-2 py-2">Created</th>
              <th className="px-2 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-t border-slate-100">
                <td className="px-2 py-2">#{order.id.slice(-8)}</td>
                <td className="px-2 py-2">{formatCurrency(order.totalAmount)}</td>
                <td className="px-2 py-2">{formatDate(order.createdAt)}</td>
                <td className="px-2 py-2">
                  <select
                    value={order.status}
                    onChange={(event) => void updateStatus(order.id, event.target.value)}
                    className="w-40"
                  >
                    {statuses.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
