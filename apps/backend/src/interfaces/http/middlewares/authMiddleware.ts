import type { NextFunction, Request, Response } from 'express';
import { JwtService } from '@/infrastructure/services/JwtService';
import { UnauthorizedError } from '@/shared/errors/UnauthorizedError';
import type { AuthenticatedRequest } from '@/shared/types/http';

const jwtService = new JwtService();

export function authMiddleware(req: Request, _res: Response, next: NextFunction): void {
  const authReq = req as AuthenticatedRequest;
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    next(new UnauthorizedError('Missing access token'));
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = jwtService.verifyAccessToken(token);
    authReq.user = {
      id: payload.sub,
      role: payload.role,
      email: payload.email
    };
    next();
  } catch {
    next(new UnauthorizedError('Invalid access token'));
  }
}
