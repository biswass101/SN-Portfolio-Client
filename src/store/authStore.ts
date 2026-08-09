import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AdminUser {
  name: string;
  email: string;
  id?: string;
}

interface AuthState {
  token: string | null;
  user: AdminUser | null;
  isAuthenticated: boolean;
  setAuth: (token: string, user: AdminUser) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: localStorage.getItem('admin_token'),
      user: null,
      isAuthenticated: !!localStorage.getItem('admin_token'),
      setAuth: (token, user) => {
        localStorage.setItem('admin_token', token);
        set({ token, user, isAuthenticated: true });
      },
      clearAuth: () => {
        localStorage.removeItem('admin_token');
        set({ token: null, user: null, isAuthenticated: false });
      },
    }),
    { name: 'admin_auth', partialize: (s) => ({ token: s.token, user: s.user, isAuthenticated: s.isAuthenticated }) }
  )
);
