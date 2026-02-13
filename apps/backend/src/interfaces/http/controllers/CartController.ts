import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import type { AppContainer } from '@/infrastructure/container';
import type { AuthenticatedRequest } from '@/shared/types/http';
import { UnauthorizedError } from '@/shared/errors/UnauthorizedError';
import { ValidationError } from '@/shared/errors/ValidationError';
import { toSingleString } from '@/shared/utils/request';

function cartToPlain(cart: {
  id?: string;
  customerId: string;
  items: Array<{ productId: string; name: string; price: number; quantity: number; imageUrl?: string }>;
  getTotalAmount: () => number;
}) {
  return {
    id: cart.id,
    customerId: cart.customerId,
    items: cart.items,
    totalAmount: cart.getTotalAmount()
  };
}

export class CartController {
  constructor(private readonly container: AppContainer) {}

  getMyCart = async (req: Request, res: Response): Promise<void> => {
    const authReq = req as AuthenticatedRequest;

    if (!authReq.user?.id) {
      throw new UnauthorizedError('Unauthorized');
    }

    const cart = await this.container.useCases.getCart.execute(authReq.user.id);

    res.status(StatusCodes.OK).json({
      success: true,
      data: cartToPlain(cart)
    });
  };

  addToCart = async (req: Request, res: Response): Promise<void> => {
    const authReq = req as AuthenticatedRequest;

    if (!authReq.user?.id) {
      throw new UnauthorizedError('Unauthorized');
    }

    const cart = await this.container.useCases.addToCart.execute({
      customerId: authReq.user.id,
      productId: req.body.productId,
      quantity: req.body.quantity
    });

    res.status(StatusCodes.OK).json({
      success: true,
      data: cartToPlain(cart)
    });
  };

  updateCartItem = async (req: Request, res: Response): Promise<void> => {
    const authReq = req as AuthenticatedRequest;

    if (!authReq.user?.id) {
      throw new UnauthorizedError('Unauthorized');
    }

    const productId = toSingleString(req.params.productId);

    if (!productId) {
      throw new ValidationError('Invalid product id');
    }

    const cart = await this.container.useCases.updateCartItem.execute({
      customerId: authReq.user.id,
      productId,
      quantity: req.body.quantity
    });

    res.status(StatusCodes.OK).json({
      success: true,
      data: cartToPlain(cart)
    });
  };

  removeFromCart = async (req: Request, res: Response): Promise<void> => {
    const authReq = req as AuthenticatedRequest;

    if (!authReq.user?.id) {
      throw new UnauthorizedError('Unauthorized');
    }

    const productId = toSingleString(req.params.productId);

    if (!productId) {
      throw new ValidationError('Invalid product id');
    }

    const cart = await this.container.useCases.removeFromCart.execute({
      customerId: authReq.user.id,
      productId
    });

    res.status(StatusCodes.OK).json({
      success: true,
      data: cartToPlain(cart)
    });
  };
}
