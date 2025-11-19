// src/controllers/auth.controller.js
// Controller functions for authentication (register, login, list users)
import { pool } from '../config/db.js';

export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if user already exists
    const userExist = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (userExist.rows.length > 0) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    // Insert new user
    await pool.query(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3)',
      [name, email, password]
    );

    res.json({ success: true, message: 'User registered successfully' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ success: false, message: 'Registration error', error });
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
      return res.status(400).json({ success: false, message: 'Incorrect credentials' });
    }

    res.json({ success: true, user: user.rows[0] });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Login error', error });
  }
};

export const usersList = async (req, res) => {
  try {
    const users = await pool.query('SELECT * FROM users');

    res.json({ success: true, users: users.rows });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ success: false, message: 'Error fetching users', error });
  }
};
