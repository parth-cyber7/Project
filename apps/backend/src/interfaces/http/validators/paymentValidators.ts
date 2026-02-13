import { z } from 'zod';

export const createPaymentIntentSchema = z.object({
  body: z.object({
    amount: z.number().positive(),
    currency: z.string().length(3).optional()
  }),
  params: z.object({}).optional().default({}),
  query: z.object({}).optional().default({}),
  cookies: z.object({}).passthrough().optional().default({}),
  headers: z.object({}).passthrough().optional().default({})
});
