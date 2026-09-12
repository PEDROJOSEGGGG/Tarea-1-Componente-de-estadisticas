import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { LoginCredentials, User } from '../types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

const demoUsers: Array<User & { password: string }> = [
  {
    id: 1,
    name: 'Roberto Silva',
    email: 'admin@empresa.com',
    role: 'admin',
    token: 'mock-token-admin',
    password: '123456',
  },
  {
    id: 2,
    name: 'Carlos Martínez',
    email: 'rrhh@empresa.com',
    role: 'hr',
    token: 'mock-token-hr',
    password: '123456',
  },
  {
    id: 3,
    name: 'Ana García',
    email: 'empleado@empresa.com',
    role: 'employee',
    token: 'mock-token-employee',
    password: '123456',
  },
];

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      login: async ({ email, password }) => {
        set({ isLoading: true, error: null });
        await new Promise((resolve) => setTimeout(resolve, 800));

        const demoUser = demoUsers.find(
          (candidate) => candidate.email === email && candidate.password === password,
        );

        if (!demoUser) {
          set({
            isLoading: false,
            error: 'Credenciales incorrectas. Usa cualquier email demo con contraseña: 123456',
          });
          return;
        }

        const user: User = {
          id: demoUser.id,
          name: demoUser.name,
          email: demoUser.email,
          role: demoUser.role,
          token: demoUser.token,
        };
        set({ user, isAuthenticated: true, isLoading: false, error: null });
      },
      logout: () => set({ user: null, isAuthenticated: false, error: null }),
      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
