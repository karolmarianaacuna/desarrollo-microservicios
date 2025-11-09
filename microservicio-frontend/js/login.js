const formualrio = document.getElementById('loginForm');
formualrio.addEventListener('submit', async(e)=>{
    e.preventDefault(); //Evita que la pagina se recargue
    
    //Es como para que los datos no se vayan sin antes haber sido capturados 

    //caputaramos los datos que el usuario manda por la parte del frontend 
    const email = document.getElementById('email');
    const password = document.getElementById('password');

    //como hace una conexion o un envio que puede falla por eso usamos el try/catch 
    try {
        
        //Eviamos datos al backend 

         const response = await axios.post('http://localhost:4000/api/auth/login', {
      email,
      password
    });

     console.log(response.data.user);

    } catch (error) {
        
    }







})