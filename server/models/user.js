import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true }, // nome único
  password: { type: String, required: true, unique: true }, // senha única
  profilePic: { type: String, default: "" }, // URL da foto de perfil
  score: { type: Number, default: 0 }, // score do jogo
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('User', userSchema);
