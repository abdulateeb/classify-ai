import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    port: 5000,
    host: true, // Allow external connections
    proxy: {
      // Forward API calls to backend to avoid CORS in dev
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Group UI libraries
          'ui-libs': ['framer-motion', 'lucide-react'],
        }
      }
    },
    // Optimize for production
    sourcemap: false,
    minify: 'terser',
  },
  define: {
    // Define production environment variables
    __DEV__: JSON.stringify(process.env.NODE_ENV === 'development'),
  },
});
