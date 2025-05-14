const express = require('express');
const connectDB = require('./db');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();
connectDB();

const app = express();
app.use(cors()); // permite acceso desde Angular
app.use(express.json());

app.use('/api/usuarios', require('./routes/usuarios.routes'));

app.listen(3000, () => {
  console.log('Servidor en http://localhost:3000');
});
