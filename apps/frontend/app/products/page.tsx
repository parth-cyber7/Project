'use client';

import { useEffect, useMemo, useState } from 'react';
import { ProductCard } from '@/components/ProductCard';
import api from '@/lib/api';
import type { ApiResponse, Product } from '@/types';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [meta, setMeta] = useState({ page: 1, totalPages: 1 });
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');

  const categories = useMemo(() => {
    const set = new Set(products.map((product) => product.category));
    return Array.from(set);
  }, [products]);

  const loadProducts = async (page = 1) => {
    setLoading(true);

    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: '12'
      });

      if (search.trim()) {
        params.set('search', search.trim());
      }

      if (category) {
        params.set('category', category);
      }

      const response = await api.get<ApiResponse<Product[]>>(`/products?${params.toString()}`);
      setProducts(response.data.data);
      setMeta({ page: response.data.meta?.page ?? 1, totalPages: response.data.meta?.totalPages ?? 1 });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadProducts(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-card">
        <h1 className="text-2xl font-bold tracking-tight">Browse Products</h1>
        <div className="mt-4 grid gap-3 md:grid-cols-[1fr_220px_120px]">
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by name or description"
          />

          <select value={category} onChange={(event) => setCategory(event.target.value)}>
            <option value="">All categories</option>
            {categories.map((entry) => (
              <option key={entry} value={entry}>
                {entry}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={() => void loadProducts(1)}
            className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
          >
            Filter
          </button>
        </div>
      </div>

      {loading ? (
        <p className="text-slate-600">Loading products...</p>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4">
        <button
          type="button"
          disabled={meta.page <= 1}
          onClick={() => void loadProducts(meta.page - 1)}
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm disabled:opacity-40"
        >
          Previous
        </button>

        <p className="text-sm text-slate-600">
          Page {meta.page} / {meta.totalPages}
        </p>

        <button
          type="button"
          disabled={meta.page >= meta.totalPages}
          onClick={() => void loadProducts(meta.page + 1)}
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  );
}
