import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import type { AppContainer } from '@/infrastructure/container';
import { ValidationError } from '@/shared/errors/ValidationError';
import { customerToPlain, orderToPlain } from '@/shared/utils/mapper';
import { toNumberOr, toSingleString } from '@/shared/utils/request';

export class CustomerAdminController {
  constructor(private readonly container: AppContainer) {}

  listCustomers = async (req: Request, res: Response): Promise<void> => {
    const page = toNumberOr(req.query.page, 1);
    const limit = toNumberOr(req.query.limit, 10);
    const search = toSingleString(req.query.search);

    const result = await this.container.useCases.listCustomers.execute({ page, limit, search });

    res.status(StatusCodes.OK).json({
      success: true,
      data: result.customers.map(customerToPlain),
      meta: {
        total: result.total,
        page,
        limit,
        totalPages: Math.ceil(result.total / limit)
      }
    });
  };

  setBlockedStatus = async (req: Request, res: Response): Promise<void> => {
    const customerId = toSingleString(req.params.customerId);

    if (!customerId) {
      throw new ValidationError('Invalid customer id');
    }

    const customer = await this.container.useCases.setCustomerBlockStatus.execute({
      customerId,
      isBlocked: req.body.isBlocked
    });

    res.status(StatusCodes.OK).json({
      success: true,
      data: customerToPlain(customer)
    });
  };

  getCustomerOrders = async (req: Request, res: Response): Promise<void> => {
    const customerId = toSingleString(req.params.customerId);

    if (!customerId) {
      throw new ValidationError('Invalid customer id');
    }

    const page = toNumberOr(req.query.page, 1);
    const limit = toNumberOr(req.query.limit, 10);

    const result = await this.container.useCases.getCustomerOrdersByAdmin.execute({
      customerId,
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
}
