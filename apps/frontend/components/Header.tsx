'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { useAuthStore } from '@/stores/authStore';
import { useCartStore } from '@/stores/cartStore';

export function Header() {
  const router = useRouter();
  const { user, clearAuth } = useAuthStore();
  const { itemCount } = useCartStore();

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // ignore logout errors
    } finally {
      clearAuth();
      router.push('/login');
    }
  };

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        <Link href="/" className="font-mono text-xl font-bold tracking-tight text-slate-900">
          CommerceCraft
        </Link>

        <nav className="flex items-center gap-4 text-sm text-slate-700">
          <Link href="/products" className="hover:text-brand-700">
            Products
          </Link>

          {user?.role === 'customer' && (
            <>
              <Link href="/cart" className="hover:text-brand-700">
                Cart ({itemCount})
              </Link>
              <Link href="/orders" className="hover:text-brand-700">
                Orders
              </Link>
            </>
          )}

          {user?.role === 'admin' && (
            <Link href="/admin/dashboard" className="hover:text-brand-700">
              Admin Panel
            </Link>
          )}

          {!user ? (
            <>
              <Link href="/login" className="rounded-lg px-3 py-1.5 hover:bg-slate-100">
                Login
              </Link>
              <Link
                href="/register"
                className="rounded-lg bg-brand-600 px-3 py-1.5 font-medium text-white hover:bg-brand-700"
              >
                Register
              </Link>
            </>
          ) : (
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-lg bg-slate-900 px-3 py-1.5 font-medium text-white hover:bg-slate-700"
            >
              Logout
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
