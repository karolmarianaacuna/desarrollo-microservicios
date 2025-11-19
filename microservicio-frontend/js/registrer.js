const registerForm = document.getElementById('registerForm');

if (registerForm) {
  registerForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

    try {
      const response = await axios.post('http://localhost:4000/api/auth/register', {
        name,
        email,
        password,
      });

      if (response.data && response.data.success) {
        alert(response.data.message || 'User registered successfully');
      } else {
        alert(response.data.message || 'Could not register user');
      }
    } catch (error) {
      console.error('Register error:', error);
      const backendMessage = error.response?.data?.message;
      if (backendMessage) {
        alert(`Error: ${backendMessage}`);
      } else {
        alert('An error occurred while connecting to the server.');
      }
    }
  });
} else {
  console.warn('Register form not found (id=registerForm)');
}
