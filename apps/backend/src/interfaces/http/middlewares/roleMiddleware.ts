import type { UserRole } from '@ecom/shared';
import type { NextFunction, Request, Response } from 'express';
import { ForbiddenError } from '@/shared/errors/ForbiddenError';
import type { AuthenticatedRequest } from '@/shared/types/http';

export function roleMiddleware(allowedRoles: UserRole[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const authReq = req as AuthenticatedRequest;

    if (!authReq.user) {
      next(new ForbiddenError('User context is missing'));
      return;
    }

    if (!allowedRoles.includes(authReq.user.role)) {
      next(new ForbiddenError('Insufficient permissions'));
      return;
    }

    next();
  };
}
