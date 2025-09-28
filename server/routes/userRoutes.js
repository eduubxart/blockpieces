import express from 'express';
// Importação de userController.js
import { registerUser, loginUser } from '../controllers/userController.js';

const router = express.Router();

// Rota para registrar (POST /api/users/register)
router.post('/register', registerUser);
// Rota para login (POST /api/users/login)
router.post('/login', loginUser);

export default router;
