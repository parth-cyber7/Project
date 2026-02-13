'use client';

import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { User } from '@/types';

interface AuthState {
  accessToken: string | null;
  user: User | null;
  isHydrated: boolean;
  setAuth: (payload: { accessToken: string; user: User }) => void;
  clearAuth: () => void;
  setHydrated: (value: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      user: null,
      isHydrated: false,
      setAuth: ({ accessToken, user }) => set({ accessToken, user }),
      clearAuth: () => set({ accessToken: null, user: null }),
      setHydrated: (value) => set({ isHydrated: value })
    }),
    {
      name: 'ecom-auth',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        accessToken: state.accessToken,
        user: state.user
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      }
    }
  )
);
