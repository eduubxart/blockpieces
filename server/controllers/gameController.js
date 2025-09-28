import User from "../models/user.js"; // CORREÇÃO: Usando 'user.js' minúsculo para Vercel (Linux)

// Atualizar score do jogo (Lógica de high score otimizada)
// Utiliza findOneAndUpdate com $lt para garantir que só atualize se o novo score for maior
export const updateScore = async (req, res) => {
  const { username, score } = req.body;

  try {
    // 1. Tenta atualizar o usuário APENAS se o novo score for maior que o atual (score: { $lt: score })
    const updatedUser = await User.findOneAndUpdate(
      { username: username, score: { $lt: score } }, 
      { $set: { score: score } }, // Ação: Define o novo score
      { new: true } // Opção: Retorna o documento atualizado
    );

    if (updatedUser) {
      // Se updatedUser existir, significa que foi um novo recorde
      return res.json({ message: "Novo recorde salvo!", score: updatedUser.score });
    }

    // Se a atualização falhou, buscamos o usuário para saber se ele existe ou se o score não era maior
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }
    
    // Se chegou aqui, o usuário existe, mas o score enviado não foi um novo recorde.
    return res.json({ message: "Score não é um novo recorde.", score: user.score });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Ranking
export const getRanking = async (req, res) => {
  try {
    // Busca os 100 melhores scores
    const ranking = await User.find()
                               .sort({ score: -1 })
                               .limit(100)
                               // Seleciona apenas os campos necessários (boa prática)
                               .select('username profilePic score'); 
    res.json(ranking); 
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
