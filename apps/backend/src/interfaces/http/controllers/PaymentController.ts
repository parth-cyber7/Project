import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import type { AppContainer } from '@/infrastructure/container';

export class PaymentController {
  constructor(private readonly container: AppContainer) {}

  createPaymentIntent = async (req: Request, res: Response): Promise<void> => {
    const result = await this.container.useCases.createPaymentIntent.execute(req.body);

    res.status(StatusCodes.OK).json({
      success: true,
      data: result
    });
  };
}
