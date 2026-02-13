import type { Request, Response } from 'express';
import { ORDER_STATUSES, type OrderStatus } from '@ecom/shared';
import { StatusCodes } from 'http-status-codes';
import type { AppContainer } from '@/infrastructure/container';
import type { AuthenticatedRequest } from '@/shared/types/http';
import { UnauthorizedError } from '@/shared/errors/UnauthorizedError';
import { ValidationError } from '@/shared/errors/ValidationError';
import { orderToPlain } from '@/shared/utils/mapper';
import { toNumberOr, toSingleString } from '@/shared/utils/request';

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

    const page = toNumberOr(req.query.page, 1);
    const limit = toNumberOr(req.query.limit, 10);

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
    const page = toNumberOr(req.query.page, 1);
    const limit = toNumberOr(req.query.limit, 10);
    const statusValue = toSingleString(req.query.status);
    const allowedStatuses = new Set<OrderStatus>(Object.values(ORDER_STATUSES));
    const status =
      statusValue && allowedStatuses.has(statusValue as OrderStatus)
        ? (statusValue as OrderStatus)
        : undefined;

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
    const orderId = toSingleString(req.params.orderId);

    if (!orderId) {
      throw new ValidationError('Invalid order id');
    }

    const order = await this.container.useCases.updateOrderStatus.execute({
      orderId,
      status: req.body.status
    });

    res.status(StatusCodes.OK).json({
      success: true,
      data: orderToPlain(order)
    });
  };
}
