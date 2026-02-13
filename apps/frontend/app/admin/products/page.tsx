'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { formatCurrency } from '@/lib/format';
import type { ApiResponse, Product } from '@/types';

const initialForm = {
  name: '',
  description: '',
  price: 0,
  stock: 0,
  category: '',
  imageUrl: ''
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const loadProducts = async () => {
    const response = await api.get<ApiResponse<Product[]>>('/products?page=1&limit=100');
    setProducts(response.data.data);
  };

  useEffect(() => {
    void loadProducts();
  }, []);

  const uploadImage = async (file: File) => {
    setUploading(true);

    try {
      const body = new FormData();
      body.append('image', file);

      const response = await api.post<ApiResponse<{ imageUrl: string }>>('/products/upload-image', body, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setForm((prev) => ({ ...prev, imageUrl: response.data.data.imageUrl }));
    } finally {
      setUploading(false);
    }
  };

  const submitProduct = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (editingId) {
      await api.patch(`/products/${editingId}`, form);
    } else {
      await api.post('/products', form);
    }

    setForm(initialForm);
    setEditingId(null);
    await loadProducts();
  };

  const startEdit = (product: Product) => {
    setEditingId(product.id);
    setForm({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      category: product.category,
      imageUrl: product.imageUrl ?? ''
    });
  };

  const deleteProduct = async (productId: string) => {
    await api.delete(`/products/${productId}`);
    await loadProducts();
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Manage Products</h1>

      <form onSubmit={submitProduct} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
        <h2 className="text-lg font-semibold">{editingId ? 'Edit Product' : 'Create Product'}</h2>

        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <input
            placeholder="Name"
            value={form.name}
            onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
            required
          />

          <input
            placeholder="Category"
            value={form.category}
            onChange={(event) => setForm((prev) => ({ ...prev, category: event.target.value }))}
            required
          />

          <input
            type="number"
            min={0}
            step="0.01"
            placeholder="Price"
            value={form.price}
            onChange={(event) => setForm((prev) => ({ ...prev, price: Number(event.target.value) }))}
            required
          />

          <input
            type="number"
            min={0}
            placeholder="Stock"
            value={form.stock}
            onChange={(event) => setForm((prev) => ({ ...prev, stock: Number(event.target.value) }))}
            required
          />

          <textarea
            placeholder="Description"
            value={form.description}
            onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
            className="md:col-span-2"
            rows={3}
            required
          />

          <input
            placeholder="Image URL"
            value={form.imageUrl}
            onChange={(event) => setForm((prev) => ({ ...prev, imageUrl: event.target.value }))}
            className="md:col-span-2"
          />

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-slate-700">Upload Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) {
                  void uploadImage(file);
                }
              }}
            />
            {uploading && <p className="mt-1 text-xs text-slate-500">Uploading...</p>}
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          <button
            type="submit"
            className="rounded-lg bg-brand-600 px-4 py-2 font-semibold text-white hover:bg-brand-700"
          >
            {editingId ? 'Update Product' : 'Create Product'}
          </button>

          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setForm(initialForm);
              }}
              className="rounded-lg border border-slate-300 px-4 py-2 font-semibold hover:bg-slate-100"
            >
              Cancel Edit
            </button>
          )}
        </div>
      </form>

      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white p-4 shadow-card">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="text-slate-500">
              <th className="px-2 py-2">Name</th>
              <th className="px-2 py-2">Category</th>
              <th className="px-2 py-2">Price</th>
              <th className="px-2 py-2">Stock</th>
              <th className="px-2 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-t border-slate-100">
                <td className="px-2 py-2">{product.name}</td>
                <td className="px-2 py-2">{product.category}</td>
                <td className="px-2 py-2">{formatCurrency(product.price)}</td>
                <td className="px-2 py-2">{product.stock}</td>
                <td className="px-2 py-2">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => startEdit(product)}
                      className="rounded border border-slate-300 px-2 py-1"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => void deleteProduct(product.id)}
                      className="rounded border border-rose-300 px-2 py-1 text-rose-700"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
