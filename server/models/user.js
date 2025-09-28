import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  // username deve ser único para login
  username: { type: String, required: true, unique: true }, 
  
  // CORREÇÃO DE SEGURANÇA: Removido 'unique: true'. O campo 'password' não deve ser único.
  // Lembre-se de implementar o HASHING (ex: bcrypt) antes de salvar senhas em produção!
  password: { type: String, required: true }, 
  
  profilePic: { type: String, default: "" }, 
  score: { type: Number, default: 0 }, 
  createdAt: { type: Date, default: Date.now }
});

// Nota: O nome da coleção no MongoDB será 'users' (plural de 'User').
export default mongoose.model('User', userSchema);
