import express from 'express';
import mongoose from 'mongoose';
import userRoutes from './server/routes/userRoutes.js';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

// Conectar MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB conectado'))
  .catch(err => console.log(err));

// Rotas do backend (API)
app.use('/api/users', userRoutes);

// Servir arquivos estáticos do build do Vite
app.use(express.static(path.join(__dirname, 'dist')));

// Rota fallback → qualquer rota que não seja /api vai pro game
app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/pages/game.html')); // abre direto o game
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
