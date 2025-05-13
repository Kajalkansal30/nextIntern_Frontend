import path from 'path';
import react from '@vitejs/plugin-react';
// import tailwindcss from '@tailwindcss/vite';
import tailwindcss from '@tailwindcss/postcss'; // ✅ FIX: Import from postcss, not vite
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
            if (id.includes('react')) {
              return 'vendor_react';
            }
            if (id.includes('framer-motion')) {
              return 'vendor_framer_motion';
            }
            if (id.includes('@dnd-kit')) {
              return 'vendor_dnd_kit';
            }
            if (id.includes('react-icons')) {
              return 'vendor_react_icons';
            }
            return 'vendor_other';
          }
        },
      },
    },
    chunkSizeWarningLimit: 1000, // Increase limit to 1000kb to reduce warnings
  },
  // css: {
  //   postcss: './postcss.config.cjs',
  // },
  css: {
    postcss: {
      plugins: [tailwindcss],
    },
  }
});
