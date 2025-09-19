
import mongoose from 'mongoose';//importa o mongoose que é o framework de banco de dados

const userShema = new mongoose.Schema({//cria o schema do usuário, shema é o modelo do banco de dados
    username: { type: String, required: true, unique: true },//nome de usuário, string, obrigatório e único
    password: { type: String, required: true },//senha, string e obrigatório
    email: { type: String, required: true, unique: true },//email, string, obrigatório e único
    createdAt: { type: Date, default: Date.now },//data de criação, data e padrão é a data atual
});

export default mongoose.model('User', userShema);//exporta o modelo do usuário para ser usado em outros arquivos
//resumido bem, nesta pasta o que eu fiz foi definir como vai ser o modelo do usuário no banco de dados, quais campos ele vai ter e como eles vão ser, e exportei para poder usar em outros arquivos, como no controller e nas rotas.

