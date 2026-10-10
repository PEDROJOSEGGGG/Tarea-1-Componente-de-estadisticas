// src/services/authService.ts
import axios from 'axios';
import type { LoginCredentials, Session, UserRole } from '../types';

// Cliente aparte para la API-RH: la API de empleados (JSON Server) no usa tokens.
export const authClient = axios.create({
  baseURL: `${import.meta.env.VITE_AUTH_API_URL ?? ''}/api/v1`,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

// Lo que responde la API-RH en /auth/login y /auth/refresh
interface AuthResponse {
  success: boolean;
  data: {
    user: {
      id: string;
      email: string;
      firstName: string;
      lastName: string;
      role: { code: UserRole; name: string };
    };
    tokens: { accessToken: string; refreshToken: string };
  };
}

// Convierte la respuesta de la API a la forma que guardamos en el store
function toSession({ data }: AuthResponse): Session {
  const { user, tokens } = data;
  return {
    user: {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role.code,
      roleName: user.role.name,
    },
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
  };
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<Session> {
    const { data } = await authClient.post<AuthResponse>('/auth/login', credentials);
    return toSession(data);
  },

  // La API rota los tokens: el refresh token enviado deja de servir
  async refresh(refreshToken: string): Promise<Session> {
    const { data } = await authClient.post<AuthResponse>('/auth/refresh', { refreshToken });
    return toSession(data);
  },

  async logout(refreshToken: string, accessToken: string): Promise<void> {
    await authClient.post(
      '/auth/logout',
      { refreshToken },
      { headers: { Authorization: `Bearer ${accessToken}` } },
    );
  },
};
