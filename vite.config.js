import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    strictPort: true,
  },
  // Agregar configuración para manejar rutas client-side
  preview: {
    port: 5173,
    strictPort: true,
  },
  base: '/'
})