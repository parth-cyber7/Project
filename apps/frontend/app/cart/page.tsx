'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { AuthGuard } from '@/components/AuthGuard';
import api from '@/lib/api';
import { formatCurrency } from '@/lib/format';
import { useCartStore } from '@/stores/cartStore';
import type { ApiResponse, Cart } from '@/types';

export default function CartPage() {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(false);
  const { setItemCount } = useCartStore();

  const loadCart = async () => {
    setLoading(true);

    try {
      const response = await api.get<ApiResponse<Cart>>('/cart');
      setCart(response.data.data);

      const count = response.data.data.items.reduce((sum, item) => sum + item.quantity, 0);
      setItemCount(count);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadCart();
  }, []);

  const updateQuantity = async (productId: string, quantity: number) => {
    await api.patch(`/cart/${productId}`, { quantity });
    await loadCart();
  };

  const removeItem = async (productId: string) => {
    await api.delete(`/cart/${productId}`);
    await loadCart();
  };

  return (
    <AuthGuard requiredRole="customer">
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Shopping Cart</h1>

        {loading ? (
          <p className="text-slate-600">Loading cart...</p>
        ) : cart && cart.items.length > 0 ? (
          <>
            <div className="space-y-3">
              {cart.items.map((item) => (
                <div
                  key={item.productId}
                  className="rounded-xl border border-slate-200 bg-white p-4 shadow-card"
                >
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <h2 className="text-lg font-semibold text-slate-900">{item.name}</h2>
                      <p className="text-sm text-slate-600">{formatCurrency(item.price)} each</p>
                    </div>

                    <div className="flex items-center gap-3">
                      <input
                        type="number"
                        min={1}
                        value={item.quantity}
                        onChange={(event) =>
                          void updateQuantity(item.productId, Number(event.target.value))
                        }
                        className="w-20"
                      />

                      <button
                        type="button"
                        onClick={() => void removeItem(item.productId)}
                        className="rounded-lg border border-rose-300 px-3 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-50"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-card">
              <p className="text-lg font-semibold">Total: {formatCurrency(cart.totalAmount)}</p>
              <Link
                href="/checkout"
                className="mt-3 inline-block rounded-lg bg-brand-600 px-4 py-2 font-semibold text-white hover:bg-brand-700"
              >
                Proceed to Checkout
              </Link>
            </div>
          </>
        ) : (
          <p className="text-slate-600">Your cart is empty.</p>
        )}
      </div>
    </AuthGuard>
  );
}
