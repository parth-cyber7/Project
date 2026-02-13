'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { formatDate } from '@/lib/format';
import type { ApiResponse, Order, User } from '@/types';

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<User[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [selectedCustomerOrders, setSelectedCustomerOrders] = useState<Order[]>([]);

  const loadCustomers = async () => {
    const response = await api.get<ApiResponse<User[]>>('/customers?page=1&limit=100');
    setCustomers(response.data.data);
  };

  useEffect(() => {
    void loadCustomers();
  }, []);

  const setBlockStatus = async (customerId: string, isBlocked: boolean) => {
    await api.patch(`/customers/${customerId}/block-status`, { isBlocked });
    await loadCustomers();
  };

  const loadCustomerOrders = async (customerId: string) => {
    const response = await api.get<ApiResponse<Order[]>>(`/customers/${customerId}/orders?page=1&limit=20`);
    setSelectedCustomerId(customerId);
    setSelectedCustomerOrders(response.data.data);
  };

  return (
    <div className="space-y-5">
      <h1 className="text-3xl font-bold tracking-tight">Manage Customers</h1>

      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white p-4 shadow-card">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="text-slate-500">
              <th className="px-2 py-2">Name</th>
              <th className="px-2 py-2">Email</th>
              <th className="px-2 py-2">Status</th>
              <th className="px-2 py-2">Created</th>
              <th className="px-2 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer.id} className="border-t border-slate-100">
                <td className="px-2 py-2">{customer.name}</td>
                <td className="px-2 py-2">{customer.email}</td>
                <td className="px-2 py-2">
                  {customer.isBlocked ? (
                    <span className="rounded-full bg-rose-100 px-2 py-1 text-xs font-semibold text-rose-700">
                      Blocked
                    </span>
                  ) : (
                    <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-700">
                      Active
                    </span>
                  )}
                </td>
                <td className="px-2 py-2">{formatDate(customer.createdAt)}</td>
                <td className="px-2 py-2">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => void setBlockStatus(customer.id, !customer.isBlocked)}
                      className="rounded border border-slate-300 px-2 py-1"
                    >
                      {customer.isBlocked ? 'Unblock' : 'Block'}
                    </button>

                    <button
                      type="button"
                      onClick={() => void loadCustomerOrders(customer.id)}
                      className="rounded border border-brand-300 px-2 py-1 text-brand-700"
                    >
                      View Orders
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedCustomerId && (
        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-card">
          <h2 className="text-lg font-semibold">Customer Orders</h2>
          {selectedCustomerOrders.length === 0 ? (
            <p className="mt-2 text-sm text-slate-600">No orders for this customer.</p>
          ) : (
            <ul className="mt-3 space-y-2">
              {selectedCustomerOrders.map((order) => (
                <li key={order.id} className="rounded-lg border border-slate-100 px-3 py-2 text-sm">
                  #{order.id.slice(-8)} • {order.status} • ${order.totalAmount}
                </li>
              ))}
            </ul>
          )}
        </section>
      )}
    </div>
  );
}
