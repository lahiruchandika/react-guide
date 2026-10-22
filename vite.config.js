import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

// Vite configuration - https://vite.dev/config/
export default defineConfig({
  // GitHub Pages serves the site from https://<user>.github.io/react-guide/
  // so the production build needs that sub-path as its base. Locally it stays "/".
  // The deploy workflow sets VITE_BASE=/react-guide/ (see .github/workflows/deploy.yml).
  base: process.env.VITE_BASE || '/',
  plugins: [react()],
  resolve: {
    // "@" is an alias for the src folder, so imports stay short and clean:
    //   import Card from '@/components/ui/Card';
    alias: { '@': path.resolve(import.meta.dirname, 'src') },
  },
  server: { port: 5173, open: true },
});
