'use client';

import { usePathname } from 'next/navigation';
import { AdminNav } from '@/components/AdminNav';
import { AuthGuard } from '@/components/AuthGuard';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  return (
    <AuthGuard requiredRole="admin">
      <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
        <AdminNav />
        <div>{children}</div>
      </div>
    </AuthGuard>
  );
}
