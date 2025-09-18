import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    // Expose environment variables to help with debugging
    __DEV__: JSON.stringify(process.env.NODE_ENV === 'development'),
  },
  server: {
    port: 5173,
    host: true,
  },
})
