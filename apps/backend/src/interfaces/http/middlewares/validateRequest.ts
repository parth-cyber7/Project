import type { NextFunction, Request, Response } from 'express';
import type { AnyZodObject } from 'zod';
import { ValidationError } from '@/shared/errors/ValidationError';

export function validateRequest(schema: AnyZodObject) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const parsed = schema.safeParse({
      body: req.body,
      params: req.params,
      query: req.query,
      cookies: req.cookies,
      headers: req.headers
    });

    if (!parsed.success) {
      next(new ValidationError('Invalid request input', parsed.error.flatten()));
      return;
    }

    req.body = parsed.data.body;
    req.params = parsed.data.params;
    req.query = parsed.data.query as Request['query'];

    next();
  };
}
