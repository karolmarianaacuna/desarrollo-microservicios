window.addEventListener('DOMContentLoaded', () => {
  const user = JSON.parse(localStorage.getItem('user'));

  if (!user) {
    // Si el usuario no existe, redirigir al frontend de LOGIN en Docker
    window.location.href = 'http://localhost:5000/login.html';
    return;
  }

  // Mostrar nombre y correo
  document.getElementById('nombreUsuario').textContent = user.name;
  document.getElementById('correoUsuario').textContent = user.email;
});
