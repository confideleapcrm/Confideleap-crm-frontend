// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      // proxy all /api requests to backend running on 3001
      '/api': {
        target: 'http://localhost:4001',
        changeOrigin: true,
        secure: false,
        // rewrite: path => path.replace(/^\/api/, '/api') // not needed, we keep same path
      },
    },
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
