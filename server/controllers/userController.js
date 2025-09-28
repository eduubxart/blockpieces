import User from "../models/user.js"; // CORREÇÃO: Usando 'user.js' minúsculo para Vercel (Linux)

// Cadastrar usuário
export const registerUser = async (req, res) => {
  const { username, password, profilePic } = req.body;
  try {
    const userExists = await User.findOne({ username });
    if (userExists) return res.status(400).json({ message: "Nome de usuário já existe" });

    // NOTA DE SEGURANÇA: Em produção, o campo 'password' DEVE ser hasheado (ex: bcrypt) antes de ser salvo.
    const newUser = new User({ username, password, profilePic });
    const savedUser = await newUser.save();
    
    // Retorna apenas dados públicos
    res.status(201).json({ 
        username: savedUser.username, 
        profilePic: savedUser.profilePic, 
        _id: savedUser._id 
    });
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
    
    // NOTA DE SEGURANÇA: Sem hash, esta comparação é insegura.
    if (user.password !== password) return res.status(401).json({ message: "Senha incorreta" });

    // Login bem-sucedido
    res.json({ username: user.username, profilePic: user.profilePic, score: user.score });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};