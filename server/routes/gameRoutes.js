import express from 'express';
import { saveScore } from '../controllers/gameController.js';

const router = express.Router();

// Rota para salvar score
router.post('/save-score', saveScore);

export default router;
