import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import type { AppContainer } from '@/infrastructure/container';
import type { AuthenticatedRequest } from '@/shared/types/http';
import { UnauthorizedError } from '@/shared/errors/UnauthorizedError';
import { orderToPlain } from '@/shared/utils/mapper';

export class OrderController {
  constructor(private readonly container: AppContainer) {}

  placeOrder = async (req: Request, res: Response): Promise<void> => {
    const authReq = req as AuthenticatedRequest;

    if (!authReq.user?.id) {
      throw new UnauthorizedError('Unauthorized');
    }

    const order = await this.container.useCases.placeOrder.execute(authReq.user.id);

    res.status(StatusCodes.CREATED).json({
      success: true,
      data: orderToPlain(order)
    });
  };

  getMyOrders = async (req: Request, res: Response): Promise<void> => {
    const authReq = req as AuthenticatedRequest;

    if (!authReq.user?.id) {
      throw new UnauthorizedError('Unauthorized');
    }

    const page = Number((req.query.page as string) ?? '1');
    const limit = Number((req.query.limit as string) ?? '10');

    const result = await this.container.useCases.getCustomerOrders.execute({
      customerId: authReq.user.id,
      page,
      limit
    });

    res.status(StatusCodes.OK).json({
      success: true,
      data: result.orders.map(orderToPlain),
      meta: {
        total: result.total,
        page,
        limit,
        totalPages: Math.ceil(result.total / limit)
      }
    });
  };

  listOrders = async (req: Request, res: Response): Promise<void> => {
    const page = Number((req.query.page as string) ?? '1');
    const limit = Number((req.query.limit as string) ?? '10');
    const status = req.query.status as any;

    const result = await this.container.useCases.listOrders.execute({
      page,
      limit,
      status
    });

    res.status(StatusCodes.OK).json({
      success: true,
      data: result.orders.map(orderToPlain),
      meta: {
        total: result.total,
        page,
        limit,
        totalPages: Math.ceil(result.total / limit)
      }
    });
  };

  updateOrderStatus = async (req: Request, res: Response): Promise<void> => {
    const order = await this.container.useCases.updateOrderStatus.execute({
      orderId: req.params.orderId,
      status: req.body.status
    });

    res.status(StatusCodes.OK).json({
      success: true,
      data: orderToPlain(order)
    });
  };
}
