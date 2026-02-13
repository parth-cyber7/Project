import { Customer } from '@/domain/customer/entities/Customer';

describe('Customer entity', () => {
  it('should create a valid customer', () => {
    const customer = new Customer({
      name: 'Jane Doe',
      email: 'jane@example.com',
      passwordHash: 'hashed',
      role: 'customer'
    });

    expect(customer.name).toBe('Jane Doe');
    expect(customer.email.toString()).toBe('jane@example.com');
    expect(customer.isBlocked).toBe(false);
  });

  it('should block and unblock a customer', () => {
    const customer = new Customer({
      name: 'Jane Doe',
      email: 'jane@example.com',
      passwordHash: 'hashed',
      role: 'customer'
    });

    customer.block();
    expect(customer.isBlocked).toBe(true);

    customer.unblock();
    expect(customer.isBlocked).toBe(false);
  });

  it('should throw for invalid name', () => {
    expect(
      () =>
        new Customer({
          name: 'J',
          email: 'jane@example.com',
          passwordHash: 'hashed',
          role: 'customer'
        })
    ).toThrow();
  });
});
