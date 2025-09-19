
// aqui vamos conectar as rotas
import express from 'express';//importa o express que é o framework para criar o servidor
import mongoose from 'mongoose';//importa o mongoose que é o framework para conectar com o banco de dados
import userRoutes from './server/routes/userRoutes.js'; //importa as rotas do usuário que foram criadas no arquivo userRoutes.js'

const app = express();// cria o servidor usando o express
app.use(express.json());//configura o servidor para receber dados em formato json

//conecta com o mongoDB(banco de dados)
mongoose.connect('mongodb+srv://fariabragaeduardo_db_user:senacprojeto09@cluster0.v9vajog.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
    .then(() => console.log('MongoDB conectado'))
    .catch(err => console.log(err));

  //aqui ele vai usar as rotas do usuário que foram criadas no arquivo userRoutes.js
app.use('/api/users', userRoutes);//todas as rotas que começarem com /api/users vão ser direcionadas para o arquivo userRoutes.js

app.listen(3000, () => console.log('Servidor rodando na porta 3000'));//aqui ele está configurando o servidor para rodar na porta 3000 e mostrar essa mensagem no console
