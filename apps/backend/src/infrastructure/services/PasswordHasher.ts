import bcrypt from 'bcryptjs';
import { env } from '@/shared/config/env';

export class PasswordHasher {
  async hash(plainText: string): Promise<string> {
    return bcrypt.hash(plainText, env.BCRYPT_SALT_ROUNDS);
  }

  async compare(plainText: string, hash: string): Promise<boolean> {
    return bcrypt.compare(plainText, hash);
  }
}
