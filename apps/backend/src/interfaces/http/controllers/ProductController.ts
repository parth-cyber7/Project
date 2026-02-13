import type { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import type { AppContainer } from '@/infrastructure/container';
import { productToPlain } from '@/shared/utils/mapper';

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
    const product = await this.container.useCases.updateProduct.execute({
      productId: req.params.productId,
      ...req.body
    });

    res.status(StatusCodes.OK).json({
      success: true,
      data: productToPlain(product)
    });
  };

  delete = async (req: Request, res: Response): Promise<void> => {
    await this.container.useCases.deleteProduct.execute(req.params.productId);

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Product deleted successfully'
    });
  };

  getById = async (req: Request, res: Response): Promise<void> => {
    const product = await this.container.useCases.getProduct.execute(req.params.productId);

    res.status(StatusCodes.OK).json({
      success: true,
      data: productToPlain(product)
    });
  };

  list = async (req: Request, res: Response): Promise<void> => {
    const query = req.query as {
      page?: string;
      limit?: string;
      search?: string;
      category?: string;
      minPrice?: string;
      maxPrice?: string;
    };

    const page = Number(query.page ?? 1);
    const limit = Number(query.limit ?? 10);

    const result = await this.container.useCases.listProducts.execute({
      page,
      limit,
      search: query.search,
      category: query.category,
      minPrice: query.minPrice ? Number(query.minPrice) : undefined,
      maxPrice: query.maxPrice ? Number(query.maxPrice) : undefined
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
