// src/utils/jwt.ts

// Lee el payload de un JWT. No verifica la firma (eso solo lo puede hacer el
// servidor); aquí solo nos interesa saber cuándo vence el token.
function readPayload(token: string): { exp?: number } | null {
  try {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(base64));
  } catch {
    return null;
  }
}

// true si el token ya venció (o vence en los próximos `marginSeconds`)
export function tokenExpired(token: string, marginSeconds = 30): boolean {
  const exp = readPayload(token)?.exp;
  if (typeof exp !== 'number') return true;
  return exp - marginSeconds <= Date.now() / 1000;
}
