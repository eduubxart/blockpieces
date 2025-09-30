import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  root: path.resolve(__dirname, 'src'),
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'src/pages/entrada.html') // entrada principal
      }
    },
    outDir: path.resolve(__dirname, 'dist'), // pasta do build
    emptyOutDir: true
  }
});
