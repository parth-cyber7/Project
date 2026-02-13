'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthGuard } from '@/components/AuthGuard';
import api from '@/lib/api';
import { formatCurrency } from '@/lib/format';
import type { ApiResponse, Cart } from '@/types';

export default function CheckoutPage() {
  const router = useRouter();
  const [cart, setCart] = useState<Cart | null>(null);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const loadCart = async () => {
      const response = await api.get<ApiResponse<Cart>>('/cart');
      setCart(response.data.data);
    };

    void loadCart();
  }, []);

  const preparePayment = async () => {
    if (!cart) {
      return;
    }

    try {
      const response = await api.post<ApiResponse<{ clientSecret: string }>>('/payments/intent', {
        amount: cart.totalAmount,
        currency: 'usd'
      });

      setClientSecret(response.data.data.clientSecret);
      setMessage('Payment intent created in Stripe sandbox.');
    } catch {
      setMessage('Stripe is not configured in this environment. You can still place the order.');
    }
  };

  const placeOrder = async () => {
    setPlacingOrder(true);

    try {
      await api.post('/orders');
      router.push('/orders');
    } finally {
      setPlacingOrder(false);
    }
  };

  return (
    <AuthGuard requiredRole="customer">
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Checkout</h1>

        {cart && cart.items.length > 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
            <h2 className="text-lg font-semibold">Order Summary</h2>
            <div className="mt-3 space-y-2 text-sm text-slate-700">
              {cart.items.map((item) => (
                <p key={item.productId}>
                  {item.name} x {item.quantity} = {formatCurrency(item.price * item.quantity)}
                </p>
              ))}
            </div>

            <p className="mt-4 text-xl font-bold">Total: {formatCurrency(cart.totalAmount)}</p>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => void preparePayment()}
                className="rounded-lg border border-slate-300 px-4 py-2 font-semibold text-slate-800 hover:bg-slate-100"
              >
                Create Stripe Payment Intent
              </button>

              <button
                type="button"
                onClick={() => void placeOrder()}
                disabled={placingOrder}
                className="rounded-lg bg-brand-600 px-4 py-2 font-semibold text-white hover:bg-brand-700 disabled:opacity-50"
              >
                {placingOrder ? 'Placing order...' : 'Place Order'}
              </button>
            </div>

            {clientSecret && <p className="mt-3 text-sm text-brand-700">Client Secret: {clientSecret}</p>}
            {message && <p className="mt-2 text-sm text-slate-600">{message}</p>}
          </div>
        ) : (
          <p className="text-slate-600">No items in cart.</p>
        )}
      </div>
    </AuthGuard>
  );
}
