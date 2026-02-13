import { createApp } from '@/app';
import { connectDatabase, disconnectDatabase } from '@/infrastructure/database/mongoose/connection';
import { logger } from '@/infrastructure/logging/logger';
import { env } from '@/shared/config/env';

async function bootstrap(): Promise<void> {
  await connectDatabase();

  const app = createApp();
  const server = app.listen(env.PORT, () => {
    logger.info(`Backend server listening on port ${env.PORT}`);
  });

  const gracefulShutdown = async (signal: string): Promise<void> => {
    logger.info(`Received ${signal}. Closing server`);

    server.close(async () => {
      await disconnectDatabase();
      logger.info('Server shutdown complete');
      process.exit(0);
    });
  };

  process.on('SIGINT', () => {
    void gracefulShutdown('SIGINT');
  });

  process.on('SIGTERM', () => {
    void gracefulShutdown('SIGTERM');
  });
}

bootstrap().catch((error) => {
  logger.error('Failed to bootstrap backend', { error });
  process.exit(1);
});
