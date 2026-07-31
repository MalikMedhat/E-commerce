import path from 'path';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

import runtimeErrorOverlay from '@replit/vite-plugin-runtime-error-modal';

// Provide sensible defaults so the build succeeds in environments
// (e.g. Vercel) where these variables are not explicitly set.
const rawPort = process.env.PORT || '3000';

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

const basePath = process.env.BASE_PATH || '/';

export default defineConfig({
  base: basePath,
  plugins: [
    react(),
    tailwindcss(),
    runtimeErrorOverlay(),
    ...(process.env.NODE_ENV !== 'production' &&
    process.env.REPL_ID !== undefined
      ? [
          await import('@replit/vite-plugin-cartographer').then((m) =>
            m.cartographer({
              root: path.resolve(import.meta.dirname, '..'),
            }),
          ),
          await import('@replit/vite-plugin-dev-banner').then((m) =>
            m.devBanner(),
          ),
        ]
      : []),
  ],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, 'src'),
      '@assets': path.resolve(
        import.meta.dirname,
        '..',
        '..',
        'attached_assets',
      ),
    },
    dedupe: ['react', 'react-dom'],
  },
  root: path.resolve(import.meta.dirname),
  build: {
    outDir: path.resolve(import.meta.dirname, 'dist/public'),
    emptyOutDir: true,
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return;

          // React core
          if (id.includes('/react/') || id.includes('/react-dom/')) {
            return 'react-vendor';
          }
          // Radix UI components
          if (id.includes('@radix-ui/')) {
            return 'ui-vendor';
          }
          // Icons
          if (id.includes('lucide-react') || id.includes('react-icons')) {
            return 'icons';
          }
          // Charts
          if (id.includes('recharts')) {
            return 'charts';
          }
          // Animations
          if (id.includes('framer-motion')) {
            return 'motion';
          }
          // Utilities
          if (
            id.includes('date-fns') ||
            id.includes('clsx') ||
            id.includes('tailwind-merge') ||
            id.includes('class-variance-authority')
          ) {
            return 'utils';
          }
          // Forms
          if (id.includes('react-hook-form') || id.includes('zod')) {
            return 'forms';
          }
          // Stripe
          if (id.includes('@stripe/')) {
            return 'stripe';
          }
          // TanStack Query
          if (id.includes('@tanstack/')) {
            return 'query';
          }
          // Wouter
          if (id.includes('wouter')) {
            return 'wouter';
          }
          // Zustand
          if (id.includes('zustand')) {
            return 'zustand';
          }
          // Sonner
          if (id.includes('sonner')) {
            return 'sonner';
          }
        },
      },
    },
  },
  server: {
    port,
    strictPort: true,
    host: '0.0.0.0',
    allowedHosts: true,
    fs: {
      strict: true,
    },
  },
  preview: {
    port,
    host: '0.0.0.0',
    allowedHosts: true,
  },
});
