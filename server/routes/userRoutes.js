// aqui vamos importar o express para criar as rotas
import express from 'express';//aqui ele vai importar o express
import { registrerUser } from '../controllers/userController.js'; // importa a função que vai registrar o usuário

const router = express.Router();// aqui ele vai criar uma rota usando o express

router.post('/register', registrerUser);// aqui ele vai criar uma rota do tipo post para registrar o usuário, quando o frontend fizer uma requisição para essa rota, ele vai chamar a função registrerUser que foi importada do controller

export default router;// aqui ele vai exportar a rota para ser usada em outros arquivos
//resumido bem, esse arquivo é responsável por criar as rotas da aplicação, nesse caso, a rota para registrar o usuário, e quando essa rota for chamada, ela vai chamar a função que está no controller para registrar o usuário no banco de dados.