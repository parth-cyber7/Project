import { z } from 'zod';

export const createProductSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    description: z.string().min(5),
    price: z.number().positive(),
    stock: z.number().int().nonnegative(),
    category: z.string().min(2),
    imageUrl: z.string().url().optional()
  }),
  params: z.object({}).optional().default({}),
  query: z.object({}).optional().default({}),
  cookies: z.object({}).passthrough().optional().default({}),
  headers: z.object({}).passthrough().optional().default({})
});

export const updateProductSchema = z.object({
  body: z.object({
    name: z.string().min(2).optional(),
    description: z.string().min(5).optional(),
    price: z.number().positive().optional(),
    stock: z.number().int().nonnegative().optional(),
    category: z.string().min(2).optional(),
    imageUrl: z.string().url().optional()
  }),
  params: z.object({
    productId: z.string().min(1)
  }),
  query: z.object({}).optional().default({}),
  cookies: z.object({}).passthrough().optional().default({}),
  headers: z.object({}).passthrough().optional().default({})
});

export const getProductSchema = z.object({
  body: z.object({}).optional().default({}),
  params: z.object({
    productId: z.string().min(1)
  }),
  query: z.object({}).optional().default({}),
  cookies: z.object({}).passthrough().optional().default({}),
  headers: z.object({}).passthrough().optional().default({})
});

export const listProductsSchema = z.object({
  body: z.object({}).optional().default({}),
  params: z.object({}).optional().default({}),
  query: z.object({
    page: z.coerce.number().int().min(1).optional().default(1),
    limit: z.coerce.number().int().min(1).max(100).optional().default(10),
    search: z.string().optional(),
    category: z.string().optional(),
    minPrice: z.coerce.number().nonnegative().optional(),
    maxPrice: z.coerce.number().nonnegative().optional()
  }),
  cookies: z.object({}).passthrough().optional().default({}),
  headers: z.object({}).passthrough().optional().default({})
});
