import { USER_ROLES } from '@ecom/shared';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import request from 'supertest';
import { createApp } from '@/app';
import { CustomerModel } from '@/infrastructure/database/mongoose/models/CustomerModel';
import { PasswordHasher } from '@/infrastructure/services/PasswordHasher';

describe('API integration', () => {
  let mongoServer: MongoMemoryServer;
  const app = createApp();

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());

    const passwordHasher = new PasswordHasher();
    const adminPasswordHash = await passwordHasher.hash('Admin@12345');

    await CustomerModel.create({
      name: 'Admin User',
      email: 'admin@test.com',
      passwordHash: adminPasswordHash,
      role: USER_ROLES.ADMIN,
      isBlocked: false
    });
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    const collections = mongoose.connection.collections;
    await Promise.all(
      Object.values(collections).map(async (collection) => {
        if (collection.collectionName === 'customers') {
          await collection.deleteMany({ email: { $ne: 'admin@test.com' } });
          return;
        }
        await collection.deleteMany({});
      })
    );
  });

  it('should register and login a customer', async () => {
    const registerResponse = await request(app).post('/api/auth/register').send({
      name: 'John Customer',
      email: 'john@test.com',
      password: 'Password@123'
    });

    expect(registerResponse.status).toBe(201);
    expect(registerResponse.body.data.email).toBe('john@test.com');

    const loginResponse = await request(app).post('/api/auth/login').send({
      email: 'john@test.com',
      password: 'Password@123'
    });

    expect(loginResponse.status).toBe(200);
    expect(loginResponse.body.data.accessToken).toBeDefined();
    expect(loginResponse.headers['set-cookie']).toBeDefined();
  });

  it('should allow admin to create product and customer to place order', async () => {
    await request(app).post('/api/auth/register').send({
      name: 'John Customer',
      email: 'john2@test.com',
      password: 'Password@123'
    });

    const adminLogin = await request(app).post('/api/auth/login').send({
      email: 'admin@test.com',
      password: 'Admin@12345'
    });

    const adminToken = adminLogin.body.data.accessToken as string;

    const createProductResponse = await request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Test Product',
        description: 'A product for integration tests',
        price: 49.99,
        stock: 20,
        category: 'Testing'
      });

    expect(createProductResponse.status).toBe(201);

    const customerLogin = await request(app).post('/api/auth/login').send({
      email: 'john2@test.com',
      password: 'Password@123'
    });

    const customerToken = customerLogin.body.data.accessToken as string;
    const productId = createProductResponse.body.data.id as string;

    const addToCartResponse = await request(app)
      .post('/api/cart')
      .set('Authorization', `Bearer ${customerToken}`)
      .send({ productId, quantity: 2 });

    expect(addToCartResponse.status).toBe(200);

    const placeOrderResponse = await request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${customerToken}`)
      .send();

    expect(placeOrderResponse.status).toBe(201);
    expect(placeOrderResponse.body.data.items).toHaveLength(1);
    expect(placeOrderResponse.body.data.totalAmount).toBe(99.98);
  });
});
