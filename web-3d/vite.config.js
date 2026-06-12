import { resolve } from 'node:path';
import { defineConfig } from 'vite';

export default defineConfig({
  base: '/InsightMesh-Agent/',
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        about: resolve(__dirname, 'about.html'),
        solutions: resolve(__dirname, 'solutions.html'),
        cases: resolve(__dirname, 'cases.html'),
        technology: resolve(__dirname, 'technology.html'),
        contact: resolve(__dirname, 'contact.html'),
      },
    },
  },
});
