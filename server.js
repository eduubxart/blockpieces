import express from 'express';
import mongoose from 'mongoose';
import userRoutes from './server/routes/UserRoutes.js'; // CORRIGIDO: Agora aponta para a pasta 'server/'
import gameRoutes from './server/routes/GameRoutes.js'; // CORRIGIDO: Agora aponta para a pasta 'server/'
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

// Conectar MongoDB
// Nota: O MONGO_URI deve estar configurado no painel da Vercel!
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB conectado'))
  .catch(err => console.log('Erro ao conectar ao MongoDB:', err)); 

// Rotas do backend (API)
app.use('/api/users', userRoutes);
app.use('/api/game', gameRoutes);

// Servir arquivos estáticos do build do Vite foi removido, pois o Vercel faz isso de forma mais eficiente (via vercel.json).

// Rota fallback -> qualquer rota que não seja /api vai para a página principal (index.html)
app.get(/^\/(?!api).*/, (req, res) => {
  // CORRIGIDO: Alinhado com o vercel.json (dist/pages/index.html)
  res.sendFile(path.join(__dirname, 'dist/pages/index.html')); 
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));