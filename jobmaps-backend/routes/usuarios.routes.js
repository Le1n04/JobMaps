const express = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/Usuario');

const router = express.Router();

router.post('/registro', async (req, res) => {
  try {
    const { nombre, apellidos, email, password, domicilio } = req.body;

    const existe = await Usuario.findOne({ email });
    if (existe) return res.status(400).json({ mensaje: 'Email ya registrado' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const nuevoUsuario = new Usuario({
      nombre,
      apellidos,
      email,
      password: hashedPassword,
      domicilio
    });

    await nuevoUsuario.save();

    res.status(201).json({ mensaje: 'Usuario registrado correctamente' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error en el servidor', error });
  }
});

module.exports = router;
