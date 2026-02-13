import type { UserRole } from '@ecom/shared';
import type { Request } from 'express';

export interface AuthUser {
  id: string;
  role: UserRole;
  email: string;
}

export interface AuthenticatedRequest extends Request {
  user?: AuthUser;
}
