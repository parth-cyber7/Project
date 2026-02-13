import { ORDER_STATUSES } from '@ecom/shared';
import { z } from 'zod';

export const listOrdersSchema = z.object({
  body: z.object({}).optional().default({}),
  params: z.object({}).optional().default({}),
  query: z.object({
    page: z.coerce.number().int().min(1).optional().default(1),
    limit: z.coerce.number().int().min(1).max(100).optional().default(10),
    status: z.enum(Object.values(ORDER_STATUSES) as [string, ...string[]]).optional()
  }),
  cookies: z.object({}).passthrough().optional().default({}),
  headers: z.object({}).passthrough().optional().default({})
});

export const updateOrderStatusSchema = z.object({
  body: z.object({
    status: z.enum(Object.values(ORDER_STATUSES) as [string, ...string[]])
  }),
  params: z.object({
    orderId: z.string().min(1)
  }),
  query: z.object({}).optional().default({}),
  cookies: z.object({}).passthrough().optional().default({}),
  headers: z.object({}).passthrough().optional().default({})
});
