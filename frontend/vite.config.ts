import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';

function copyPublicLight() {
  return {
    name: 'copy-public-light',
    closeBundle() {
      const publicDir = path.resolve(__dirname, 'public');
      const distDir = path.resolve(__dirname, 'dist');
      const items = ['images', 'manifest.json', 'favicon.svg', 'robots.txt', 'sitemap.xml', 'sw.js'];
      for (const item of items) {
        const src = path.join(publicDir, item);
        const dst = path.join(distDir, item);
        if (fs.existsSync(src)) {
          fs.cpSync(src, dst, { recursive: true, force: true });
        }
      }
    }
  };
}

export default defineConfig({
  plugins: [react(), copyPublicLight()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
      },
      '/stream': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: false,
    copyPublicDir: false,
    sourcemap: true,
    chunkSizeWarningLimit: 700,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-ui': ['lucide-react', 'clsx', 'react-hot-toast'],
          'vendor-state': ['zustand'],
          'vendor-firebase': ['firebase/app', 'firebase/auth', 'firebase/firestore', 'firebase/storage'],
        },
      },
    },
  },
});
