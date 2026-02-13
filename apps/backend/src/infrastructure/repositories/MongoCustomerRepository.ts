import { Customer } from '@/domain/customer/entities/Customer';
import {
  type CustomerListQuery,
  type CustomerListResult,
  type CustomerRepository
} from '@/domain/customer/repositories/CustomerRepository';
import { CustomerModel } from '@/infrastructure/database/mongoose/models/CustomerModel';
import { getPagination } from '@/shared/utils/pagination';

function toEntity(doc: any): Customer {
  return new Customer({
    id: doc._id.toString(),
    name: doc.name,
    email: doc.email,
    passwordHash: doc.passwordHash,
    role: doc.role,
    isBlocked: doc.isBlocked,
    createdAt: doc.createdAt,
    refreshTokenHash: doc.refreshTokenHash
  });
}

export class MongoCustomerRepository implements CustomerRepository {
  async create(customer: Customer): Promise<Customer> {
    const created = await CustomerModel.create({
      name: customer.name,
      email: customer.email.toString(),
      passwordHash: customer.passwordHash,
      role: customer.role,
      isBlocked: customer.isBlocked,
      refreshTokenHash: customer.refreshTokenHash
    });

    return toEntity(created);
  }

  async findByEmail(email: string): Promise<Customer | null> {
    const customer = await CustomerModel.findOne({ email: email.toLowerCase() }).lean();
    return customer ? toEntity(customer) : null;
  }

  async findById(id: string): Promise<Customer | null> {
    const customer = await CustomerModel.findById(id).lean();
    return customer ? toEntity(customer) : null;
  }

  async list(query: CustomerListQuery): Promise<CustomerListResult> {
    const { page, limit, skip } = getPagination(query.page, query.limit);

    const filter = query.search
      ? {
          $or: [
            { name: { $regex: query.search, $options: 'i' } },
            { email: { $regex: query.search, $options: 'i' } }
          ]
        }
      : {};

    const [customers, total] = await Promise.all([
      CustomerModel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      CustomerModel.countDocuments(filter)
    ]);

    return {
      customers: customers.map(toEntity),
      total
    };
  }

  async setBlockedStatus(customerId: string, isBlocked: boolean): Promise<Customer | null> {
    const customer = await CustomerModel.findByIdAndUpdate(
      customerId,
      { isBlocked },
      { new: true }
    ).lean();

    return customer ? toEntity(customer) : null;
  }

  async saveRefreshTokenHash(customerId: string, refreshTokenHash: string | null): Promise<void> {
    await CustomerModel.findByIdAndUpdate(customerId, { refreshTokenHash }).exec();
  }
}
