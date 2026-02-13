import { Cart } from '../entities/Cart';

export interface CartRepository {
  findByCustomerId(customerId: string): Promise<Cart | null>;
  save(cart: Cart): Promise<Cart>;
  clearByCustomerId(customerId: string): Promise<void>;
}
