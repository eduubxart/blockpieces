import User from '../models/User.js';

// Atualizar score do jogo
export const saveScore = async (req, res) => {
  const { username, score } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: "Usuário não encontrado" });

    // Só atualiza se o score for maior que o atual
    if (score > user.score) {
      user.score = score;
      await user.save();
    }

    res.json({ message: "Score salvo!", score: user.score });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
