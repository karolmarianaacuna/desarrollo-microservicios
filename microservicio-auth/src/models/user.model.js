//Estructura del usuario
export const User={
    createTable:`
    CREATE TABLE IF NOT EXIST users(
    id SERIAL PRIMARY KEY,
    name VARCHAR(50),
    email VARCHAR(30) UNIQUE,
    password VARCHAR(100)
    );`
};
//Podrás ejecutar este SQL una vez al iniciar tu servidor.