import type { AdminRepository } from '@/domain/admin/repositories/AdminRepository';

export class GetDashboardStatsUseCase {
  constructor(private readonly adminRepository: AdminRepository) {}

  async execute() {
    return this.adminRepository.getDashboardStats();
  }
}
