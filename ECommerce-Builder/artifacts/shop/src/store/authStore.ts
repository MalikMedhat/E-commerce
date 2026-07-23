import { create } from 'zustand';
import { User } from '@workspace/api-client-react';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  setUser: (user: User) => void;
  logout: () => void;
  hydrate: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  setAuth: (user, token) => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('authToken', token);
    }
    set({ user, token, isAuthenticated: true });
  },
  setUser: (user) => {
    set({ user });
  },
  logout: () => {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem('authToken');
    }
    set({ user: null, token: null, isAuthenticated: false });
  },
  hydrate: () => {
    if (typeof window === 'undefined') {
      return;
    }

    const token = window.localStorage.getItem('authToken');
    if (token) {
      set({ token, isAuthenticated: true });
    }
  }
}));
