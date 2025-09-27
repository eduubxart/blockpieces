import express from 'express';
import mongoose from 'mongoose';
import userRoutes from './server/routes/userRoutes.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

// Conectar MongoDB
mongoose.connect('mongodb+srv://fariabragaeduardo_db_user:sLTwu3KvBix3YNj9@cluster0.v9vajog.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
    .then(() => console.log('MongoDB conectado'))
    .catch(err => console.log(err));

// Rotas do backend (API)
app.use('/api/users', userRoutes);

// Servir arquivos estáticos do build do Vite
app.use(express.static(path.join(__dirname, 'dist')));

// Rota fallback → só para páginas do frontend, ignora /api
app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/pages/ranking.html'));
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
