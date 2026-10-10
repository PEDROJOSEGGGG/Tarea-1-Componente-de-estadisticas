// src/utils/errors.ts
import axios from 'axios';
import toast from 'react-hot-toast';

// La API-RH responde los errores así: { success: false, error: { code, message } }
// El "code" no cambia, así que lo usamos para mostrar el mensaje en español.
const apiCodeMessages: Record<string, string> = {
  INVALID_CREDENTIALS: 'El correo o la contraseña no son correctos.',
  UNAUTHORIZED: 'Tu sesión ya no es válida. Vuelve a iniciar sesión.',
  INSUFFICIENT_ROLE: 'Tu rol no tiene permiso para hacer esto.',
  NOT_FOUND: 'No encontramos lo que buscabas.',
};

const statusMessages: Record<number, string> = {
  400: 'Los datos enviados no son válidos.',
  401: 'Tu sesión expiró. Vuelve a iniciar sesión.',
  403: 'Tu rol no tiene permiso para hacer esto.',
  404: 'No encontramos lo que buscabas.',
  409: 'Ya existe un registro con esos datos.',
  422: 'Los datos enviados no son válidos.',
};

export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    if (!error.response) {
      return error.code === 'ECONNABORTED'
        ? 'El servidor tardó demasiado en responder.'
        : 'No hay conexión con el servidor.';
    }

    const { status, data } = error.response;
    const code: string | undefined = data?.error?.code;
    if (code && apiCodeMessages[code]) return apiCodeMessages[code];
    if (status >= 500) return 'El servidor tuvo un problema. Intenta más tarde.';
    if (statusMessages[status]) return statusMessages[status];
    return data?.error?.message ?? `Error inesperado (${status}).`;
  }

  if (error instanceof Error) return error.message;
  return 'Ocurrió un error inesperado.';
}

// Errores "de infraestructura": sin red, 403 o 5xx. Los avisa el interceptor
// de axios una sola vez, así cada pantalla no tiene que repetirlos.
export function isInfrastructureError(error: unknown): boolean {
  if (!axios.isAxiosError(error)) return false;
  const status = error.response?.status;
  return status === undefined || status === 403 || status >= 500;
}

export function notifyInfrastructureError(error: unknown) {
  if (!isInfrastructureError(error)) return;
  // El id evita que se apilen toasts iguales si fallan varias peticiones juntas
  const status = axios.isAxiosError(error) ? error.response?.status ?? 'red' : 'red';
  toast.error(getErrorMessage(error), { id: `infra-${status}` });
}

// Para los errores propios de cada acción (crear, editar, borrar...)
export function toastError(error: unknown, action: string) {
  console.error(`[${action}]`, error);
  if (isInfrastructureError(error)) return; // ya lo avisó el interceptor
  toast.error(`${action}: ${getErrorMessage(error)}`);
}
