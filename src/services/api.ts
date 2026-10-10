// src/services/api.ts
import axios from 'axios';
import { notifyInfrastructureError } from '../utils/errors';

// API de empleados: JSON Server en local, o la URL pública definida en VITE_API_URL.
// La autenticación va aparte, contra la API-RH (ver authService.ts).
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Avisa con un toast si el servidor está caído o responde 5xx
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    notifyInfrastructureError(error);
    return Promise.reject(error);
  }
);
