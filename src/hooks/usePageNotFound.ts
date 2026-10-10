// src/hooks/usePageNotFound.ts
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Deja registro en consola de cada URL que no coincidió con ninguna ruta.
// Devuelve la ruta para que la página la pueda mostrar.
export function usePageNotFound() {
  const location = useLocation();
  const missingUrl = `${location.pathname}${location.search}${location.hash}`;

  useEffect(() => {
    console.warn(`[404] No existe la ruta: ${missingUrl}`);
  }, [missingUrl]);

  return missingUrl;
}
