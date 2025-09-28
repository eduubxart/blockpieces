import express from 'express';
import mongoose from 'mongoose';
import userRoutes from './routes/userRoutes.js'; 
import gameRoutes from './routes/gameRoutes.js'; // Importa as rotas de Jogo
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

// Configuração para utilizar __dirname e __filename em módulos ES (import/export)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

// Conectar MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB conectado'))
  .catch(err => console.log('Erro ao conectar ao MongoDB:', err)); 

// Rotas do backend (API)
app.use('/api/users', userRoutes); // Rota para autenticação e dados do usuário
app.use('/api/game', gameRoutes);   // Rota para ranking e score

// Servir arquivos estáticos do build do Vite
app.use(express.static(path.join(__dirname, 'dist')));

// Rota fallback -> qualquer rota que não seja /api vai pro game
app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/pages/game.html')); 
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));