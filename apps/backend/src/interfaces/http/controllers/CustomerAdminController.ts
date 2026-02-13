import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import type { AppContainer } from '@/infrastructure/container';
import { customerToPlain, orderToPlain } from '@/shared/utils/mapper';

export class CustomerAdminController {
  constructor(private readonly container: AppContainer) {}

  listCustomers = async (req: Request, res: Response): Promise<void> => {
    const page = Number((req.query.page as string) ?? '1');
    const limit = Number((req.query.limit as string) ?? '10');
    const search = req.query.search as string | undefined;

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
    const customer = await this.container.useCases.setCustomerBlockStatus.execute({
      customerId: req.params.customerId,
      isBlocked: req.body.isBlocked
    });

    res.status(StatusCodes.OK).json({
      success: true,
      data: customerToPlain(customer)
    });
  };

  getCustomerOrders = async (req: Request, res: Response): Promise<void> => {
    const page = Number((req.query.page as string) ?? '1');
    const limit = Number((req.query.limit as string) ?? '10');

    const result = await this.container.useCases.getCustomerOrdersByAdmin.execute({
      customerId: req.params.customerId,
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
