import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import type { AppContainer } from '@/infrastructure/container';
import type { AuthenticatedRequest } from '@/shared/types/http';
import { clearRefreshTokenCookie, setRefreshTokenCookie } from '@/shared/utils/http';
import { customerToPlain } from '@/shared/utils/mapper';
import { UnauthorizedError } from '@/shared/errors/UnauthorizedError';

export class AuthController {
  constructor(private readonly container: AppContainer) {}

  register = async (req: Request, res: Response): Promise<void> => {
    const customer = await this.container.useCases.registerCustomer.execute(req.body);

    res.status(StatusCodes.CREATED).json({
      success: true,
      data: customerToPlain(customer)
    });
  };

  login = async (req: Request, res: Response): Promise<void> => {
    const result = await this.container.useCases.login.execute(req.body);

    setRefreshTokenCookie(res, result.refreshToken);

    res.status(StatusCodes.OK).json({
      success: true,
      data: {
        accessToken: result.accessToken,
        customer: customerToPlain(result.customer)
      }
    });
  };

  refresh = async (req: Request, res: Response): Promise<void> => {
    const refreshToken = req.cookies.refreshToken as string;
    const result = await this.container.useCases.refreshToken.execute(refreshToken);

    setRefreshTokenCookie(res, result.refreshToken);

    res.status(StatusCodes.OK).json({
      success: true,
      data: {
        accessToken: result.accessToken
      }
    });
  };

  logout = async (req: Request, res: Response): Promise<void> => {
    const authReq = req as AuthenticatedRequest;

    if (!authReq.user?.id) {
      throw new UnauthorizedError('Unauthorized');
    }

    await this.container.useCases.logout.execute(authReq.user.id);
    clearRefreshTokenCookie(res);

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Logged out successfully'
    });
  };

  me = async (req: Request, res: Response): Promise<void> => {
    const authReq = req as AuthenticatedRequest;

    if (!authReq.user?.id) {
      throw new UnauthorizedError('Unauthorized');
    }

    const customer = await this.container.repositories.customerRepository.findById(authReq.user.id);

    if (!customer) {
      throw new UnauthorizedError('User not found');
    }

    res.status(StatusCodes.OK).json({
      success: true,
      data: customerToPlain(customer)
    });
  };
}
