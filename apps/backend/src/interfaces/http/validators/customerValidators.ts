import { z } from 'zod';

export const listCustomersSchema = z.object({
  body: z.object({}).optional().default({}),
  params: z.object({}).optional().default({}),
  query: z.object({
    page: z.coerce.number().int().min(1).optional().default(1),
    limit: z.coerce.number().int().min(1).max(100).optional().default(10),
    search: z.string().optional()
  }),
  cookies: z.object({}).passthrough().optional().default({}),
  headers: z.object({}).passthrough().optional().default({})
});

export const setCustomerBlockStatusSchema = z.object({
  body: z.object({
    isBlocked: z.boolean()
  }),
  params: z.object({
    customerId: z.string().min(1)
  }),
  query: z.object({}).optional().default({}),
  cookies: z.object({}).passthrough().optional().default({}),
  headers: z.object({}).passthrough().optional().default({})
});

export const customerOrdersSchema = z.object({
  body: z.object({}).optional().default({}),
  params: z.object({
    customerId: z.string().min(1)
  }),
  query: z.object({
    page: z.coerce.number().int().min(1).optional().default(1),
    limit: z.coerce.number().int().min(1).max(100).optional().default(10)
  }),
  cookies: z.object({}).passthrough().optional().default({}),
  headers: z.object({}).passthrough().optional().default({})
});
