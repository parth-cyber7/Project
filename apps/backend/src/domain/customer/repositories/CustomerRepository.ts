import { Customer } from '../entities/Customer';

export interface CustomerListQuery {
  page: number;
  limit: number;
  search?: string;
}

export interface CustomerListResult {
  customers: Customer[];
  total: number;
}

export interface CustomerRepository {
  create(customer: Customer): Promise<Customer>;
  findByEmail(email: string): Promise<Customer | null>;
  findById(id: string): Promise<Customer | null>;
  list(query: CustomerListQuery): Promise<CustomerListResult>;
  setBlockedStatus(customerId: string, isBlocked: boolean): Promise<Customer | null>;
  saveRefreshTokenHash(customerId: string, refreshTokenHash: string | null): Promise<void>;
}
