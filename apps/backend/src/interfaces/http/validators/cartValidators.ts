import { z } from 'zod';

export const addToCartSchema = z.object({
  body: z.object({
    productId: z.string().min(1),
    quantity: z.number().int().positive()
  }),
  params: z.object({}).optional().default({}),
  query: z.object({}).optional().default({}),
  cookies: z.object({}).passthrough().optional().default({}),
  headers: z.object({}).passthrough().optional().default({})
});

export const updateCartItemSchema = z.object({
  body: z.object({
    quantity: z.number().int().nonnegative()
  }),
  params: z.object({
    productId: z.string().min(1)
  }),
  query: z.object({}).optional().default({}),
  cookies: z.object({}).passthrough().optional().default({}),
  headers: z.object({}).passthrough().optional().default({})
});

export const removeFromCartSchema = z.object({
  body: z.object({}).optional().default({}),
  params: z.object({
    productId: z.string().min(1)
  }),
  query: z.object({}).optional().default({}),
  cookies: z.object({}).passthrough().optional().default({}),
  headers: z.object({}).passthrough().optional().default({})
});
