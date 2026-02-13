import { USER_ROLES } from '@ecom/shared';
import { connectDatabase, disconnectDatabase } from '@/infrastructure/database/mongoose/connection';
import { CustomerModel } from '@/infrastructure/database/mongoose/models/CustomerModel';
import { ProductModel } from '@/infrastructure/database/mongoose/models/ProductModel';
import { PasswordHasher } from '@/infrastructure/services/PasswordHasher';
import { logger } from '@/infrastructure/logging/logger';

async function seed() {
  await connectDatabase();

  const passwordHasher = new PasswordHasher();
  const adminEmail = 'admin@ecom.local';
  const adminPassword = 'Admin@12345';

  const existingAdmin = await CustomerModel.findOne({ email: adminEmail });

  if (!existingAdmin) {
    const passwordHash = await passwordHasher.hash(adminPassword);

    await CustomerModel.create({
      name: 'Platform Admin',
      email: adminEmail,
      passwordHash,
      role: USER_ROLES.ADMIN,
      isBlocked: false
    });

    logger.info('Seeded admin user', {
      email: adminEmail,
      password: adminPassword
    });
  }

  const productCount = await ProductModel.countDocuments();

  if (productCount === 0) {
    await ProductModel.insertMany([
      {
        name: 'Wireless Headphones',
        description: 'Noise-cancelling over-ear Bluetooth headphones',
        price: 199.99,
        stock: 50,
        category: 'Electronics',
        imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e'
      },
      {
        name: 'Running Shoes',
        description: 'Breathable lightweight running shoes',
        price: 89.99,
        stock: 120,
        category: 'Footwear',
        imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff'
      },
      {
        name: 'Smart Watch',
        description: 'Fitness tracking smartwatch with heart-rate monitoring',
        price: 149.99,
        stock: 75,
        category: 'Electronics',
        imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30'
      }
    ]);

    logger.info('Seeded sample products');
  }

  logger.info('Database seeding complete');
  await disconnectDatabase();
}

seed().catch(async (error) => {
  const normalizedError =
    error instanceof Error
      ? {
          name: error.name,
          message: error.message,
          stack: error.stack
        }
      : { value: error };

  logger.error('Seed failed', normalizedError);

  try {
    await disconnectDatabase();
  } catch (disconnectError) {
    const normalizedDisconnectError =
      disconnectError instanceof Error
        ? {
            name: disconnectError.name,
            message: disconnectError.message,
            stack: disconnectError.stack
          }
        : { value: disconnectError };
    logger.error('Seed disconnect failed', normalizedDisconnectError);
  }

  process.exit(1);
});
