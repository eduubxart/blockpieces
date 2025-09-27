import User from '../models/User.js';

// Cadastrar usuário
export const registerUser = async (req, res) => {
  const { username, password, profilePic } = req.body;
  try {
    const userExists = await User.findOne({ username });
    if (userExists) return res.status(400).json({ message: "Nome de usuário já existe" });

    const newUser = new User({ username, password, profilePic });
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login
export const loginUser = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: "Usuário não encontrado" });
    if (user.password !== password) return res.status(401).json({ message: "Senha incorreta" });

    res.json({ username: user.username, profilePic: user.profilePic, score: user.score });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Atualizar score
export const updateScore = async (req, res) => {
  const { username, score } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: "Usuário não encontrado" });

    user.score = score;
    await user.save();
    res.json({ message: "Score atualizado!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Ranking
export const getRanking = async (req, res) => {
  try {
    const ranking = await User.find().sort({ score: -1 }).limit(100);
    res.json(ranking); // username, profilePic e score
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
