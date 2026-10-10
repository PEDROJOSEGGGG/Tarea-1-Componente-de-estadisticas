import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import toast from 'react-hot-toast';
import type { LoginCredentials, Session, SessionUser } from '../types';
import { authService } from '../services/authService';
import { getErrorMessage } from '../utils/errors';
import { tokenExpired } from '../utils/jwt';

interface AuthState {
  user: SessionUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  renewSession: () => Promise<boolean>;
  verifySession: () => Promise<void>;
  clearError: () => void;
}

const emptySession = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
};

const fromSession = (session: Session) => ({ ...session, isAuthenticated: true });

// Como el refresh token solo sirve una vez, si dos partes de la app piden
// renovar al mismo tiempo (p. ej. StrictMode) ambas esperan la misma petición.
let pendingRenewal: Promise<boolean> | null = null;

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      ...emptySession,
      isLoading: false,
      error: null,

      login: async (credentials) => {
        set({ isLoading: true, error: null });
        try {
          const session = await authService.login(credentials);
          set({ ...fromSession(session), isLoading: false });
          toast.success(`¡Hola, ${session.user.firstName}!`);
        } catch (err) {
          set({ isLoading: false, error: getErrorMessage(err) });
        }
      },

      logout: () => {
        const { accessToken, refreshToken } = get();
        set(emptySession);
        if (accessToken && refreshToken) {
          // Si la API falla aquí no importa: la sesión local ya se cerró
          authService.logout(refreshToken, accessToken).catch(() => {});
          toast.success('Cerraste sesión.');
        }
      },

      renewSession: () => {
        if (pendingRenewal) return pendingRenewal;

        const { refreshToken } = get();
        if (!refreshToken) return Promise.resolve(false);

        pendingRenewal = authService
          .refresh(refreshToken)
          .then((session) => {
            set(fromSession(session));
            return true;
          })
          .catch(() => {
            set(emptySession);
            toast.error('Tu sesión expiró. Vuelve a iniciar sesión.', { id: 'session-expired' });
            return false;
          })
          .finally(() => {
            pendingRenewal = null;
          });

        return pendingRenewal;
      },

      // Se llama al abrir la app y cada pocos minutos: si el access token
      // venció intenta renovarlo sin que el usuario lo note.
      verifySession: async () => {
        const { accessToken, renewSession } = get();
        if (accessToken && tokenExpired(accessToken)) {
          await renewSession();
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'mini-rrhh-session',
      partialize: ({ user, accessToken, refreshToken, isAuthenticated }) => ({
        user,
        accessToken,
        refreshToken,
        isAuthenticated,
      }),
    },
  ),
);
