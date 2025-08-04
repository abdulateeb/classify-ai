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
