// Lógica (qué hace cada ruta)
import { pool } from '../config/db.js'

export const registerUser = async (requerimiento, respuesta) => {
    const { name, email, password } = requerimiento.body;
    //Aquí tomamos los datos que vienen del frontend.
    try {
        //primero se verifica si el usuario existe y si no se crea
        const userExist = await pool.query(
            'SELECT * FROM users WHERE email=$1',
            [email]
        );
        if (userExist.rows.length > 0) {
            return res.status(400).json({ message: 'El usuario ya existe' });
        }
        // si el usuario  no existe, se crea
        await pool.query(
            'INSER INTO users (name,email,password) VALUES ($1, $2, $3)',
            [name, email, password]
        );
        res.json({ message: 'Usuario registrado correctamente' });
    } catch {
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
    res.status(500).json({ message: 'Error al iniciar sesión', error });
  }
};
