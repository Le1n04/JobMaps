const express = require('express');
const bcrypt = require('bcrypt');
const Usuario = require('../models/Usuario');
const router = express.Router();

// Registro
router.post('/registro', async (req, res) => {
  console.log('REQ.BODY:', req.body);
  const { nombre, email, password, rol } = req.body;

  const existe = await Usuario.findOne({ email });
  if (existe) return res.status(400).json({ error: 'Ya existe un usuario con ese email' });

  const hash = await bcrypt.hash(password, 10);
  const nuevo = new Usuario({ nombre, email, password: hash, rol });
  await nuevo.save();

  res.status(201).json({ mensaje: 'Usuario registrado correctamente' });
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const usuario = await Usuario.findOne({ email });
  if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });

  const match = await bcrypt.compare(password, usuario.password);
  if (!match) return res.status(401).json({ error: 'password incorrecta' });

  res.json({ mensaje: 'Login correcto', usuario });
});

module.exports = router;
