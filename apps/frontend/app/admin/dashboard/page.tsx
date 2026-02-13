'use client';

import { useEffect, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import api from '@/lib/api';
import { formatCurrency, formatDate } from '@/lib/format';
import type { ApiResponse, DashboardStats } from '@/types';

function StatCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{title}</p>
      <p className="mt-2 text-2xl font-bold text-slate-900">{value}</p>
    </div>
  );
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    const loadStats = async () => {
      const response = await api.get<ApiResponse<DashboardStats>>('/admin/dashboard');
      setStats(response.data.data);
    };

    void loadStats();
  }, []);

  if (!stats) {
    return <p className="text-slate-600">Loading dashboard...</p>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard title="Total Revenue" value={formatCurrency(stats.totalRevenue)} />
        <StatCard title="Total Orders" value={String(stats.totalOrders)} />
        <StatCard title="Total Customers" value={String(stats.totalCustomers)} />
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-card">
          <h2 className="mb-4 text-lg font-semibold">Monthly Sales</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats.monthlySales}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="revenue" stroke="#128985" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-card">
          <h2 className="mb-4 text-lg font-semibold">Top Selling Products</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.topSellingProducts}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="quantitySold" fill="#f08a24" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-card">
        <h2 className="mb-4 text-lg font-semibold">Recent Orders</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="text-slate-500">
                <th className="px-2 py-2">Order</th>
                <th className="px-2 py-2">Status</th>
                <th className="px-2 py-2">Total</th>
                <th className="px-2 py-2">Created</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentOrders.map((order) => (
                <tr key={order.id} className="border-t border-slate-100">
                  <td className="px-2 py-2">#{order.id.slice(-8)}</td>
                  <td className="px-2 py-2 capitalize">{order.status}</td>
                  <td className="px-2 py-2">{formatCurrency(order.totalAmount)}</td>
                  <td className="px-2 py-2">{formatDate(order.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
