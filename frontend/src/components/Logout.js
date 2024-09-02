// src/components/Logout.js
import React from 'react';

function Logout() {
  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  return <button onClick={handleLogout}>Logout</button>;
}

export default Logout;
