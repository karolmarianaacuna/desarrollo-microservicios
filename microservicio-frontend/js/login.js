const fomulario = document.getElementById('loginForm');
fomulario.addEventListener('submit', async(e)=>{
    e.preventDefault(); //Evita que la pagina se recargue
    
    //Es como para que los datos no se vayan sin antes haber sido capturados 

    //caputaramos los datos que el usuario manda por la parte del frontend 
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    //como hace una conexion o un envio que puede falla por eso usamos el try/catch 
    try {
        //Eviamos datos al backend 
         const response = await axios.post('http://localhost:4000/api/auth/login', {
      email,
      password
    });

     // Aquí asumimos que el backend responde con algo como:
    // { success: true, user: {...} }
    if (response.data.success) {
      console.log('Login correcto:', response.data.user);
      // Redirigir al usuario
      window.location.href = '/dashboard.html';
    } else {
      alert('Credenciales incorrectas');
    }

    } catch (error) {
        
    }







})