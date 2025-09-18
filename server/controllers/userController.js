import User from '../models/user.js';//importa o modelo do usuário que foi criado no arquivo user.js
//esse função vai receber os dados do frontend e salvar no banco de dados
export const registerUser = async (req, res) => {// aqui é uma função assíncrona que vai receber a requisição e a resposta
    const { username, password , email } = req.body;//aqui ele está pegando os dados que foram enviados pelo frontend, que estão no corpo da requisição
    try {
        //verifica se o usuário já existe no banco de dados
        const UserExists = await User.FindOne({ email });//aqui ele está procurando no banco de dados se já existe um usuário com o email que foi enviado
            if (UserExists) {
                return res.status(400).json({ message: 'Usuário ja existe' });//se já existir, ele retorna um status 400 e uma mensagem de erro
        }

        //Cria o usuário
        const newUser = new User({ username, password, email });//aqui ele está criando um novo usuário com os dados que foram enviados

        //Salva o usuário no banco de dados retornando com sucesso
        res.status(201).json(await newUser.save());//aqui ele está salvando o usuário no banco de dados e retornando um status 201 e o usuário que foi salvo
    } catch (error) {//se der algum erro, ele cai aqui
        res.status(500).json({ message: error.message });//se der algum erro, ele retorna um status 500 e a mensagem do erro

    }
};//resumido bem, essa função recebe os dados do frontend, verifica se o usuário já existe no banco de dados, se não existir, cria um novo usuário e salva no banco de dados, e retorna uma resposta para o frontend.