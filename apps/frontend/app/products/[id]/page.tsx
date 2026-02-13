'use client';

import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { formatCurrency } from '@/lib/format';
import { useAuthStore } from '@/stores/authStore';
import { useCartStore } from '@/stores/cartStore';
import type { ApiResponse, Product } from '@/types';

export default function ProductDetailsPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const { user } = useAuthStore();
  const { setItemCount } = useCartStore();

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const response = await api.get<ApiResponse<Product>>(`/products/${params.id}`);
        setProduct(response.data.data);
      } catch {
        setProduct(null);
      }
    };

    void loadProduct();
  }, [params.id]);

  const addToCart = async () => {
    if (!user) {
      router.push('/login');
      return;
    }

    if (user.role !== 'customer') {
      return;
    }

    setLoading(true);

    try {
      const response = await api.post<ApiResponse<{ items: Array<{ quantity: number }> }>>('/cart', {
        productId: product?.id,
        quantity
      });

      const count = response.data.data.items.reduce((sum, item) => sum + item.quantity, 0);
      setItemCount(count);
    } finally {
      setLoading(false);
    }
  };

  if (!product) {
    return <p className="text-slate-600">Product not found.</p>;
  }

  return (
    <div className="grid gap-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-card md:grid-cols-2">
      <div className="relative h-80 overflow-hidden rounded-2xl bg-slate-100">
        {product.imageUrl ? (
          <Image src={product.imageUrl} alt={product.name} fill className="object-cover" />
        ) : (
          <div className="grid h-full place-items-center text-slate-500">No Image</div>
        )}
      </div>

      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-brand-700">{product.category}</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">{product.name}</h1>
        <p className="mt-3 text-slate-600">{product.description}</p>

        <p className="mt-4 text-2xl font-bold text-slate-900">{formatCurrency(product.price)}</p>
        <p className="mt-2 text-sm text-slate-500">Stock available: {product.stock}</p>

        <div className="mt-6 flex items-center gap-3">
          <input
            type="number"
            min={1}
            max={product.stock}
            value={quantity}
            onChange={(event) => setQuantity(Number(event.target.value))}
            className="w-24"
          />
          <button
            type="button"
            onClick={() => void addToCart()}
            disabled={loading || quantity < 1 || quantity > product.stock}
            className="rounded-lg bg-brand-600 px-5 py-2.5 font-semibold text-white hover:bg-brand-700 disabled:opacity-50"
          >
            {loading ? 'Adding...' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
}
