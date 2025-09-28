import express from 'express';
import mongoose from 'mongoose';
import userRoutes from './server/routes/userRoutes.js'; // Caminho corrigido para o Vercel
import gameRoutes from './server/routes/gameRoutes.js'; // Caminho corrigido para o Vercel
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
// O Vercel deve estar configurado com a variável de ambiente MONGO_URI
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB conectado'))
  .catch(err => console.error('Erro ao conectar ao MongoDB:', err)); 

// Rotas do backend (API)
app.use('/api/users', userRoutes); // Rota para autenticação e dados do usuário
app.use('/api/game', gameRoutes);   // Rota para ranking e score

// NOTE: A linha app.use(express.static(...)) foi removida.
// O Vercel serve arquivos estáticos de forma mais eficiente (como configurado no vercel.json).

// Rota fallback (catch-all)
// Se a Vercel não resolver o caminho estático, o Express envia o index.html
// O caminho agora é 'dist/index.html' para ser consistente com o vercel.json
app.get(/^\/(?!api).*/, (req, res) => {
  // Garantindo que a Vercel use o mesmo arquivo que a rota estática tenta servir.
  res.sendFile(path.join(__dirname, 'dist/index.html')); 
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));