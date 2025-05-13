import path from 'path';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/postcss';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) {
              return 'vendorreact';
            }
            if (id.includes('framer-motion')) {
              return 'vendorframermotion';
            }
            if (id.includes('@dnd-kit')) {
              return 'vendordndkit';
            }
            if (id.includes('react-icons')) {
              return 'vendorreacticons';
            }
            return 'vendorother';
          }
        },
      },
    },
    chunkSizeWarningLimit: 1000, // Increase limit to 1000kb to reduce warnings
  },
  css: {
    postcss: {
      plugins: [tailwindcss],
    },
  },
});
