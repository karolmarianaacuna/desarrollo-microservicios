const loginForm = document.getElementById('loginForm');

// Attach submit handler if the form exists
if (loginForm) {
  loginForm.addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent page reload

    // Read form values
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

    try {
      // Send login request to auth service
      const response = await axios.post('http://localhost:4000/api/auth/login', {
        email,
        password,
      });

      // Handle different response shapes from backend
      if (response.data && response.data.success) {
        console.log('Login successful:', response.data.user);
        alert(response.data.message || 'Login successful!');

        // Save user in localStorage (for the game microservice frontend to read)
        try {
          if (response.data.user) {
            localStorage.setItem('user', JSON.stringify(response.data.user));
          }
        } catch (e) {
          console.warn('Could not save user in localStorage:', e);
        }

        // Redirect to game microservice (no tokens used)
        window.location.href = 'http://localhost:8089/';
        return;
      }

      if (response.data && response.data.user) {
        // Backend returned a user object but no explicit success flag
        console.log('Login successful (no success flag):', response.data.user);
        try {
          localStorage.setItem('user', JSON.stringify(response.data.user));
        } catch (e) {
          console.warn('Could not save user in localStorage:', e);
        }
        window.location.href = 'http://localhost:8089/';
        return;
      }

      // Fallback: show message from backend or generic invalid credentials
      alert(response.data?.message || 'Invalid credentials');
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
} else {
  console.warn('Login form not found (id=loginForm)');
}
