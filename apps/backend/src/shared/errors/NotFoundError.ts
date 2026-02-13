import { StatusCodes } from 'http-status-codes';
import { AppError } from './AppError';

export class NotFoundError extends AppError {
  constructor(message = 'Resource not found') {
    super(message, StatusCodes.NOT_FOUND, 'NOT_FOUND');
  }
}
