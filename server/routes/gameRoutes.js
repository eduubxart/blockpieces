import express from 'express';
// Importação de gameController.js
import { updateScore, getRanking } from '../controllers/gameController.js'; 

const router = express.Router();

// Rota para atualizar o placar (POST /api/game/score)
router.post('/score', updateScore);
// Rota para o ranking (GET /api/game/ranking)
router.get('/ranking', getRanking);

export default router;
