'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import api from '@/lib/api';
import { useAuthStore } from '@/stores/authStore';
import type { ApiResponse, User } from '@/types';

export default function AdminLoginPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await api.post<ApiResponse<{ accessToken: string; customer: User }>>(
        '/auth/login',
        form
      );

      if (response.data.data.customer.role !== 'admin') {
        setError('This account is not an admin account.');
        return;
      }

      setAuth({
        accessToken: response.data.data.accessToken,
        user: response.data.data.customer
      });

      router.push('/admin/dashboard');
    } catch (requestError: any) {
      setError(requestError?.response?.data?.error?.message ?? 'Unable to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
      <h1 className="text-2xl font-bold">Admin Login</h1>
      <p className="mt-1 text-sm text-slate-600">Only admin accounts can access this panel.</p>

      <form className="mt-6 space-y-4" onSubmit={onSubmit}>
        <input
          type="email"
          placeholder="Admin Email"
          value={form.email}
          onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
          required
        />

        {error && <p className="text-sm text-rose-700">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-slate-900 px-4 py-2.5 font-semibold text-white hover:bg-slate-700 disabled:opacity-50"
        >
          {loading ? 'Signing in...' : 'Sign In as Admin'}
        </button>
      </form>
    </div>
  );
}
