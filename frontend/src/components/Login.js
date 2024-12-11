import React, { useState } from 'react';
import axios from 'axios';
import './Login.css';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate(); // Initialize navigate for redirection

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('https://medicine-shop-backend.vercel.app/api/auth/login', {
        username,
        password
      });

      // If the response includes a token, it means the login was successful
      const { token } = response.data;
      localStorage.setItem('token', token); // Store the token in localStorage
      window.location.href = '/'; // Redirect to home page after successful login
    } catch (error) {
      // If error.response contains a "User not found" message, navigate to the signup page
      if (error.response && error.response.data.message === 'Invalid credentials') {
        navigate('/signup'); // Redirect to signup page
      } else {
        setError(error.response ? error.response.data.message : error.message); // Set other error messages
      }
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
      {error && <p>{error}</p>}
    </div>
  );
};

export default Login;
