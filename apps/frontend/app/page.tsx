'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ProductCard } from '@/components/ProductCard';
import api from '@/lib/api';
import type { ApiResponse, Product } from '@/types';

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await api.get<ApiResponse<Product[]>>('/products?limit=8&page=1');
        setProducts(response.data.data);
      } finally {
        setLoading(false);
      }
    };

    void loadProducts();
  }, []);

  return (
    <div className="space-y-10">
      <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-8 shadow-card">
        <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-brand-100 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-40 w-40 rounded-full bg-accent-100 blur-3xl" />
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-brand-700">Modern Commerce</p>
        <h1 className="max-w-2xl text-4xl font-bold tracking-tight text-slate-900">Ship faster with a scalable DDD eCommerce platform.</h1>
        <p className="mt-3 max-w-2xl text-slate-600">
          Browse curated products, manage secure orders, and scale your storefront with a production-ready architecture.
        </p>
        <div className="mt-6 flex gap-3">
          <Link href="/products" className="rounded-lg bg-brand-600 px-5 py-2.5 font-semibold text-white hover:bg-brand-700">
            Explore Products
          </Link>
          <Link href="/admin/login" className="rounded-lg border border-slate-300 px-5 py-2.5 font-semibold text-slate-800 hover:bg-slate-100">
            Admin Login
          </Link>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">Featured Products</h2>

        {loading ? (
          <p className="text-slate-600">Loading products...</p>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
