import type { AdminDashboard } from '../entities/AdminDashboard';

export interface AdminRepository {
  getDashboardStats(): Promise<AdminDashboard>;
}
