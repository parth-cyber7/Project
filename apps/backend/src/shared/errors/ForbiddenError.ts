import { StatusCodes } from 'http-status-codes';
import { AppError } from './AppError';

export class ForbiddenError extends AppError {
  constructor(message = 'Forbidden') {
    super(message, StatusCodes.FORBIDDEN, 'FORBIDDEN');
  }
}
