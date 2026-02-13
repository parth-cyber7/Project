import cors from 'cors';
import cookieParser from 'cookie-parser';
import express from 'express';
import type { Express } from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'node:path';
import swaggerUi from 'swagger-ui-express';
import { createContainer } from '@/infrastructure/container';
import { errorHandler, notFoundHandler } from '@/interfaces/http/middlewares/errorHandler';
import { requestLogger } from '@/interfaces/http/middlewares/requestLogger';
import { createApiRoutes } from '@/interfaces/http/routes';
import { swaggerSpec } from '@/interfaces/http/docs/swagger';
import { env } from '@/shared/config/env';

export function createApp(): Express {
  const app = express();
  const container = createContainer();

  app.use(helmet());
  app.use(
    cors({
      origin: env.CORS_ORIGIN,
      credentials: true
    })
  );

  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000,
      max: env.RATE_LIMIT_MAX,
      standardHeaders: true,
      legacyHeaders: false
    })
  );

  app.use(requestLogger);
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  app.get('/health', (_req, res) => {
    res.status(200).json({
      status: 'ok',
      timestamp: new Date().toISOString()
    });
  });

  app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  app.use('/api', createApiRoutes(container));

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
