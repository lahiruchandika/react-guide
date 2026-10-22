import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

// Vite configuration - https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    // "@" is an alias for the src folder, so imports stay short and clean:
    //   import Card from '@/components/ui/Card';
    alias: { '@': path.resolve(import.meta.dirname, 'src') },
  },
  server: { port: 5173, open: true },
});
