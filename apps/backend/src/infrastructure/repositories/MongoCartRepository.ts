import { Cart } from '@/domain/customer/entities/Cart';
import type { CartRepository } from '@/domain/customer/repositories/CartRepository';
import { CartModel } from '@/infrastructure/database/mongoose/models/CartModel';

function toEntity(doc: any): Cart {
  return new Cart({
    id: doc._id.toString(),
    customerId: doc.customerId.toString(),
    items: doc.items.map((item: any) => ({
      productId: item.productId.toString(),
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      imageUrl: item.imageUrl
    })),
    updatedAt: doc.updatedAt
  });
}

export class MongoCartRepository implements CartRepository {
  async findByCustomerId(customerId: string): Promise<Cart | null> {
    const cart = await CartModel.findOne({ customerId }).lean();
    return cart ? toEntity(cart) : null;
  }

  async save(cart: Cart): Promise<Cart> {
    const updated = await CartModel.findOneAndUpdate(
      { customerId: cart.customerId },
      {
        customerId: cart.customerId,
        items: cart.items.map((item) => ({
          productId: item.productId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          imageUrl: item.imageUrl
        }))
      },
      { new: true, upsert: true }
    ).lean();

    return toEntity(updated);
  }

  async clearByCustomerId(customerId: string): Promise<void> {
    await CartModel.findOneAndUpdate({ customerId }, { items: [] }, { upsert: true }).exec();
  }
}
