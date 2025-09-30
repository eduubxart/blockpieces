import express from 'express';
import mongoose from 'mongoose';
import userRoutes from './server/routes/userRoutes.js'; 
import gameRoutes from './server/routes/gameRoutes.js';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

// Configuração para utilizar __dirname e __filename em módulos ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// O código de frontend (botão) foi movido para 'entrada.js'
// e o bloco try/catch não é mais necessário, tornando o servidor limpo.

const app = express();
app.use(express.json());

// Conexão com o Banco de Dados
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB conectado'))
  .catch(err => console.log('Erro ao conectar ao MongoDB:', err)); 

// Rotas do backend (API)
app.use('/api/users', userRoutes); 
app.use('/api/game', gameRoutes);

// Rota fallback: Captura todo o tráfego que não é API e serve o HTML principal.
app.get(/^\/(?!api).*/, (req, res) => {
  // CORREÇÃO FINAL: O servidor agora procura e envia o arquivo 'entrada.html'.
  const filePath = path.resolve(process.cwd(), 'dist', 'pages', 'entrada.html');
  
  res.sendFile(filePath, (err) => {
      if (err) {
          console.error("Erro ao tentar servir entrada.html:", err.message);
          res.status(404).send("404 Not Found: Arquivo principal de front-end (entrada.html) não encontrado.");
      }
  });
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
