import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // JSON Server reescribe db.json al crear/editar/borrar; si Vite lo vigila
    // recarga toda la página y se pierden los toasts.
    watch: { ignored: ['**/db.json'] },
  },
  preview: {
    allowedHosts: ['tarea-1-componente-de-estadisticas.onrender.com'],
  },
})
