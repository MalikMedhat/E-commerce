
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  isAuthenticated: boolean;
  user: { id: string; name: string; email: string } | null;
  token: string | null;
  hydrate: () => void;
  login: (token: string, user: { id: string; name: string; email: string }) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      token: null,
      hydrate: () => set((state) => ({ isAuthenticated: !!state.token, })),
      login: (token, user) => set({ isAuthenticated: true, token, user }),
      logout: () => set({ isAuthenticated: false, user: null, token: null }),
    }),
    { name: 'auth-storage' }
  )
);
