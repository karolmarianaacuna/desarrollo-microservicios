//Punto de entrada del servidor

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes.js';
import { User } from './models/user.model.js';

dotenv.config();

const app = express();
//Crea mi servidor Express.

app.use(cors());
//Permite que otras aplicaciones (como el frontend) puedan hablar con este servidor

app.use(express.json());
//Permite que el servidor entienda los datos JSON enviados por el cliente

app.use('/api/auth', authRoutes);
console.log("🚀 Rutas de autenticación cargadas correctamente");

User.init();

app.get('/', (req, res) => res.send('API funcionando 🚀'));

//indica como se debe entrar : ejemplo= /api/auth/login
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);

});