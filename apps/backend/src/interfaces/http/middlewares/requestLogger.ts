import morgan from 'morgan';
import { logger } from '@/infrastructure/logging/logger';

export const requestLogger = morgan('combined', {
  stream: {
    write: (message: string) => {
      logger.info(message.trim());
    }
  }
});
