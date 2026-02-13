'use client';

import Image from 'next/image';
import Link from 'next/link';
import { formatCurrency } from '@/lib/format';
import type { Product } from '@/types';

interface Props {
  product: Product;
}

export function ProductCard({ product }: Props) {
  return (
    <article className="group rounded-2xl border border-slate-200 bg-white p-4 shadow-card transition hover:-translate-y-1">
      <Link href={`/products/${product.id}`}>
        <div className="relative mb-4 h-48 overflow-hidden rounded-xl bg-slate-100">
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="object-cover transition duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="grid h-full place-items-center text-slate-500">No Image</div>
          )}
        </div>
      </Link>

      <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-brand-700">{product.category}</p>
      <h3 className="line-clamp-1 text-lg font-semibold text-slate-900">{product.name}</h3>
      <p className="mb-3 line-clamp-2 text-sm text-slate-600">{product.description}</p>

      <div className="flex items-center justify-between">
        <span className="text-lg font-bold text-slate-900">{formatCurrency(product.price)}</span>
        <span className="rounded-full bg-brand-50 px-2 py-1 text-xs font-semibold text-brand-700">
          Stock: {product.stock}
        </span>
      </div>
    </article>
  );
}
