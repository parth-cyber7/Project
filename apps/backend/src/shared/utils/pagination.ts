export function getPagination(page?: number, limit?: number): { page: number; limit: number; skip: number } {
  const safePage = !page || page < 1 ? 1 : page;
  const safeLimit = !limit || limit < 1 ? 10 : Math.min(limit, 100);

  return {
    page: safePage,
    limit: safeLimit,
    skip: (safePage - 1) * safeLimit
  };
}
