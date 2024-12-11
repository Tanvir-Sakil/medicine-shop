// Signup.js
import React, { useState } from 'react';
import axios from 'axios';
import './Signup.css'; // Add a CSS file for styling

function Signup() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      const response = await axios.post('https://medicine-shop-backend.vercel.app/api/auth/signup', {
        username,
        password,
        role
      });
      setMessage(response.data.message); // Success message from backend
      // Optionally redirect to login or home page
      setTimeout(() => {
        window.location.href = '/login'; // Redirect to login page after signup
      }, 2000);
    } catch (error) {
      setError(error.response ? error.response.data.message : 'Error signing up');
    }
  };

  return (
    <div className="signup-container">
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
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
        <div>
          <label>Role:</label>
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="user">User</option>
            <option value="admin" disabled>Admin</option>
          </select>
        </div>
        <button type="submit">Sign Up</button>
      </form>
      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}
    </div>
  );
}

export default Signup;
