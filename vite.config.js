// vite.config.js
import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
  root: './src', // pasta onde estão seus arquivos HTML/JS/CSS
  build: {
    outDir: '../dist', // pasta de saída do build
    emptyOutDir: true, // limpa dist antes de buildar
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'src/index.html') // ponto de entrada do seu jogo
      }
    }
  },
  server: {
    port: 3000, // porta para rodar localmente
    open: true // abre no navegador automaticamente
  }
})
