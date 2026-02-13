import { USER_ROLES, type UserRole } from '@ecom/shared';
import { Email } from '../value-objects/Email';

export interface CustomerProps {
  id?: string;
  name: string;
  email: string;
  passwordHash: string;
  role?: UserRole;
  isBlocked?: boolean;
  createdAt?: Date;
  refreshTokenHash?: string | null;
}

export class Customer {
  public readonly id?: string;
  public name: string;
  public email: Email;
  public passwordHash: string;
  public role: UserRole;
  public isBlocked: boolean;
  public readonly createdAt: Date;
  public refreshTokenHash: string | null;

  constructor(props: CustomerProps) {
    this.id = props.id;
    this.name = props.name.trim();
    this.email = new Email(props.email);
    this.passwordHash = props.passwordHash;
    this.role = props.role ?? USER_ROLES.CUSTOMER;
    this.isBlocked = props.isBlocked ?? false;
    this.createdAt = props.createdAt ?? new Date();
    this.refreshTokenHash = props.refreshTokenHash ?? null;

    if (!this.name || this.name.length < 2) {
      throw new Error('Name should be at least 2 characters long');
    }
  }

  block(): void {
    this.isBlocked = true;
  }

  unblock(): void {
    this.isBlocked = false;
  }

  setRefreshTokenHash(hash: string | null): void {
    this.refreshTokenHash = hash;
  }
}
