const loginForm = document.getElementById('loginForm');

loginForm.addEventListener('submit', async (event) => {
  event.preventDefault(); // Prevent page reload

  // Get form data
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();

  try {
    // Send data to backend
    const response = await axios.post('http://localhost:4000/api/auth/login', {
      email,
      password
    });

    // Check backend response (make robust against different response shapes)
    if (response.data && response.data.success) {

      console.log('Login successful:', response.data.user);
      alert(response.data.message || 'Login successful!');
      // Save user in localStorage and redirect to the game microservice (no token)
      try {
        if (response.data.user) {
          localStorage.setItem('user', JSON.stringify(response.data.user));
        }
      } catch (e) {
        console.warn('Could not save user in localStorage:', e);
      }
      window.location.href = 'http://localhost:5000/';

    } else if (response.data && response.data.user) {

      // Case: backend returned user but not the "success" flag
      console.log('Login successful (no success flag):', response.data.user);
      try {
        localStorage.setItem('user', JSON.stringify(response.data.user));
      } catch (e) {
        console.warn('Could not save user in localStorage:', e);
      }
      window.location.href = 'http://localhost:5000/'; // Redirect to the game microservice
    } else {
      alert(response.data?.message || 'Invalid credentials');
    }

  } catch (error) {
    console.error('Login error:', error);
    // Show backend message if present
    const backendMessage = error.response?.data?.message;
    if (backendMessage) {
      alert(`Error: ${backendMessage}`);
    } else {
      alert('An error occurred while connecting to the server.');
    }
  }
});
