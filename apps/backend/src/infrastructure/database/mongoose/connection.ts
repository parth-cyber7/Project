import mongoose from 'mongoose';
import { env } from '@/shared/config/env';
import { logger } from '@/infrastructure/logging/logger';

export async function connectDatabase(): Promise<void> {
  await mongoose.connect(env.MONGODB_URI);
  logger.info('MongoDB connected');
}

export async function disconnectDatabase(): Promise<void> {
  await mongoose.disconnect();
}
