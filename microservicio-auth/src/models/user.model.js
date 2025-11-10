import { pool } from "../config/db.js";

//Estructura del usuario
export const User={
    createTable:`
    CREATE TABLE IF NOT EXISTS users(
    id SERIAL PRIMARY KEY,
    name VARCHAR(50),
    email VARCHAR(30) UNIQUE,
    password VARCHAR(100)
    );`,

   // Método para crear la tabla
  async init() {
    try {
      await pool.query(this.createTable);
      console.log("✅ Tabla 'users' creada con éxito");
    } catch (err) {
      console.error("❌ Error creando tabla:", err);
    }
  }
};
//Podrás ejecutar este SQL una vez al iniciar tu servidor.


//tenemso  que crear una funcion para inciializar la creacion de las tablas 

