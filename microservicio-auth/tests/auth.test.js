
import { jest } from '@jest/globals';


const mockQuery = jest.fn();

jest.unstable_mockModule('../src/config/db.js', () => ({
  pool: { query: mockQuery }
}));


const { registerUser, loginUser } = await import('../src/controllers/auth.controller.js');


const mockRequest = (body) => ({ body });
const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('Pruebas unitarias de auth.controller.js', () => {
  beforeEach(() => {
    mockQuery.mockClear();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });


  // TEST: Registro de usuario

  test('Debe registrar un usuario nuevo si no existe', async () => {
    const req = mockRequest({ 
      name: 'Juan', 
      email: 'juan@test.com', 
      password: '1234' 
    });
    const res = mockResponse();


    mockQuery
      .mockResolvedValueOnce({ rows: [] }) 
      .mockResolvedValueOnce({ rows: [] }); 

    await registerUser(req, res);

    expect(mockQuery).toHaveBeenCalledTimes(2);
    expect(mockQuery).toHaveBeenNthCalledWith(
      1, 
      'SELECT * FROM users WHERE email = $1', 
      ['juan@test.com']
    );
    expect(mockQuery).toHaveBeenNthCalledWith(
      2,
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3)',
      ['Juan', 'juan@test.com', '1234']
    );
    expect(res.json).toHaveBeenCalledWith({ 
      message: 'Usuario registrado correctamente' 
    });
  });

  test('Debe devolver error si el usuario ya existe', async () => {
    const req = mockRequest({ 
      name: 'Juan', 
      email: 'juan@test.com', 
      password: '1234' 
    });
    const res = mockResponse();

  
    mockQuery.mockResolvedValueOnce({ 
      rows: [{ id: 1, email: 'juan@test.com' }] 
    });

    await registerUser(req, res);

    expect(mockQuery).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ 
      message: 'El usuario ya existe' 
    });
  });

  test('Debe capturar errores en el registro', async () => {
    const req = mockRequest({ 
      name: 'Juan', 
      email: 'juan@test.com', 
      password: '1234' 
    });
    const res = mockResponse();

  
    mockQuery.mockRejectedValueOnce(new Error('Error de conexión a DB'));

    await registerUser(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ 
      message: 'Error en el registro', 
      error: expect.any(Error) 
    });
  });

 
  // TEST: Login de usuario
 
  test('Debe permitir login con credenciales válidas', async () => {
    const req = mockRequest({ 
      email: 'juan@test.com', 
      password: '1234' 
    });
    const res = mockResponse();

   
    mockQuery.mockResolvedValueOnce({
      rows: [{ 
        id: 1, 
        email: 'juan@test.com', 
        password: '1234',
        name: 'Juan'
      }],
    });

    await loginUser(req, res);

    expect(mockQuery).toHaveBeenCalledWith(
      'SELECT * FROM users WHERE email = $1 AND password = $2',
      ['juan@test.com', '1234']
    );
    expect(res.json).toHaveBeenCalledWith({
      message: 'Inicio de sesión exitoso',
      user: expect.objectContaining({
        id: 1, 
        email: 'juan@test.com'
      }),
    });
  });

  test('Debe rechazar login con credenciales incorrectas', async () => {
    const req = mockRequest({ 
      email: 'juan@test.com', 
      password: 'mala' 
    });
    const res = mockResponse();

   
    mockQuery.mockResolvedValueOnce({ rows: [] });

    await loginUser(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ 
      message: 'Credenciales incorrectas' 
    });
  });

  test('Debe capturar errores en login', async () => {
    const req = mockRequest({ 
      email: 'juan@test.com', 
      password: '1234' 
    });
    const res = mockResponse();

    
    mockQuery.mockRejectedValueOnce(new Error('Error de conexión'));

    await loginUser(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ 
      message: 'Error al iniciar sesión', 
      error: expect.any(Error) 
    });
  });
});
