import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, Link } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode'; // Use correct import for jwtDecode
import MedicineSearch from './components/MedicineSearch';
import AdminPanel from './components/AdminPanel';
import Signup from './components/Signup';
import Login from './components/Login'; // Ensure you have a Login component

function App() {
  const token = localStorage.getItem('token');
  let isAdmin = false;
  let isLoggedIn = false;

  if (token) {
    const decodedToken = jwtDecode(token);
    isAdmin = decodedToken.role === 'admin';
    isLoggedIn = true;
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.reload(); // Reload the page to update UI
  };

  return (
    <Router>
      <div>
        <nav>
          <div className="nav-left">
          <Link to="/">Search Medicine</Link></div>
          <div className="nav-right">
          {isAdmin && <Link to="/admin">Admin Panel</Link>}
          {isLoggedIn ? (
            <button onClick={handleLogout}>Logout</button>
          ) : (
            <Link to="/login">Login</Link>
          )}
          </div>
        </nav>
        <Routes>
          <Route path="/" element={<MedicineSearch />} />
          {isAdmin && <Route path="/admin" element={<AdminPanel />} />}
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
