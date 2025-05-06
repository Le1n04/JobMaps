const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
  nombre: String,
  email: String,
  password: String,
  rol: { type: String, enum: ['candidato', 'empresa', 'admin'], default: 'candidato' },
  fecha_registro: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Usuario', usuarioSchema);
