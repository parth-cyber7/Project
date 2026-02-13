'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';

interface Props {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'customer';
}

export function AuthGuard({ children, requiredRole }: Props) {
  const router = useRouter();
  const { user, accessToken, isHydrated } = useAuthStore();

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    if (!user || !accessToken) {
      router.replace('/login');
      return;
    }

    if (requiredRole && user.role !== requiredRole) {
      router.replace(user.role === 'admin' ? '/admin/dashboard' : '/');
    }
  }, [user, accessToken, isHydrated, requiredRole, router]);

  if (!isHydrated || !user || !accessToken) {
    return <div className="p-6 text-slate-600">Checking session...</div>;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <div className="p-6 text-slate-600">Redirecting...</div>;
  }

  return <>{children}</>;
}
