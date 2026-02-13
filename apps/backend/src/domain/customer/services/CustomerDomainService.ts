import { Customer } from '../entities/Customer';

export class CustomerDomainService {
  static ensureCustomerActive(customer: Customer): void {
    if (customer.isBlocked) {
      throw new Error('Customer is blocked');
    }
  }
}
