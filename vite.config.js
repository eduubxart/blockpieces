// vite.config.js
import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
  root: './src', // onde está seu index.html
  build: {
    outDir: '../dist', // pasta de saída do build
    emptyOutDir: true,
    rollupOptions: {
      input: path.resolve(__dirname, 'src/index.html')
    }
  },
  server: {
    port: 3000,
    open: true
  }
})
