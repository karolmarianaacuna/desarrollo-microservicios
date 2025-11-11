// src/controllers/auth.controller.js
import { pool } from '../config/db.js';

export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Verificar si el usuario ya existe
    const userExist = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (userExist.rows.length > 0) {
      return res.status(400).json({ message: 'El usuario ya existe' });
    }

    // Insertar usuario nuevo
    await pool.query(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3)',
      [name, email, password]
    );

    res.json({ message: 'Usuario registrado correctamente' });
  } catch (error) {
    console.error('Error en el registro:', error);
    res.status(500).json({ message: 'Error en el registro', error });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await pool.query(
      'SELECT * FROM users WHERE email = $1 AND password = $2',
      [email, password]
    );

    if (user.rows.length === 0) {
      return res.status(400).json({ message: 'Credenciales incorrectas' });
    }

    res.json({ message: 'Inicio de sesión exitoso', user: user.rows[0] });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ message: 'Error al iniciar sesión', error });
  }
};
