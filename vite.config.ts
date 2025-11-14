
import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'url';

export default defineConfig({
    server: {
      port: 3000,
      host: '0.0.0.0',
    },
    plugins: [react()],
    resolve: {
      alias: {
        // Fix: __dirname is not available in ES modules.
        // We use import.meta.url to get the current file's path and derive the directory name.
        '@': path.dirname(fileURLToPath(import.meta.url)),
      }
    }
});
