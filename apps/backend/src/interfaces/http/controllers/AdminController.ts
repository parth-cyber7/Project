import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import type { AppContainer } from '@/infrastructure/container';
import { orderToPlain } from '@/shared/utils/mapper';

export class AdminController {
  constructor(private readonly container: AppContainer) {}

  dashboard = async (_req: Request, res: Response): Promise<void> => {
    const stats = await this.container.useCases.getDashboardStats.execute();

    res.status(StatusCodes.OK).json({
      success: true,
      data: {
        ...stats,
        recentOrders: stats.recentOrders.map(orderToPlain)
      }
    });
  };
}
