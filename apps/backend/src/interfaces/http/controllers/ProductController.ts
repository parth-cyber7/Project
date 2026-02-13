import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import type { AppContainer } from '@/infrastructure/container';
import { ValidationError } from '@/shared/errors/ValidationError';
import { productToPlain } from '@/shared/utils/mapper';
import { toNumberOr, toSingleString } from '@/shared/utils/request';

export class ProductController {
  constructor(private readonly container: AppContainer) {}

  create = async (req: Request, res: Response): Promise<void> => {
    const product = await this.container.useCases.createProduct.execute(req.body);

    res.status(StatusCodes.CREATED).json({
      success: true,
      data: productToPlain(product)
    });
  };

  update = async (req: Request, res: Response): Promise<void> => {
    const productId = toSingleString(req.params.productId);

    if (!productId) {
      throw new ValidationError('Invalid product id');
    }

    const product = await this.container.useCases.updateProduct.execute({
      productId,
      ...req.body
    });

    res.status(StatusCodes.OK).json({
      success: true,
      data: productToPlain(product)
    });
  };

  delete = async (req: Request, res: Response): Promise<void> => {
    const productId = toSingleString(req.params.productId);

    if (!productId) {
      throw new ValidationError('Invalid product id');
    }

    await this.container.useCases.deleteProduct.execute(productId);

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Product deleted successfully'
    });
  };

  getById = async (req: Request, res: Response): Promise<void> => {
    const productId = toSingleString(req.params.productId);

    if (!productId) {
      throw new ValidationError('Invalid product id');
    }

    const product = await this.container.useCases.getProduct.execute(productId);

    res.status(StatusCodes.OK).json({
      success: true,
      data: productToPlain(product)
    });
  };

  list = async (req: Request, res: Response): Promise<void> => {
    const page = toNumberOr(req.query.page, 1);
    const limit = toNumberOr(req.query.limit, 10);
    const search = toSingleString(req.query.search);
    const category = toSingleString(req.query.category);
    const minPriceRaw = toSingleString(req.query.minPrice);
    const maxPriceRaw = toSingleString(req.query.maxPrice);

    const result = await this.container.useCases.listProducts.execute({
      page,
      limit,
      search,
      category,
      minPrice: minPriceRaw !== undefined ? Number(minPriceRaw) : undefined,
      maxPrice: maxPriceRaw !== undefined ? Number(maxPriceRaw) : undefined
    });

    res.status(StatusCodes.OK).json({
      success: true,
      data: result.products.map(productToPlain),
      meta: {
        total: result.total,
        page,
        limit,
        totalPages: Math.ceil(result.total / limit)
      }
    });
  };

  uploadImage = async (req: Request, res: Response): Promise<void> => {
    if (!req.file) {
      res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        error: {
          code: 'FILE_REQUIRED',
          message: 'Please upload an image file'
        }
      });
      return;
    }

    const imageUrl = `/uploads/${req.file.filename}`;

    res.status(StatusCodes.CREATED).json({
      success: true,
      data: {
        imageUrl
      }
    });
  };
}
