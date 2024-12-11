// App.js
import React, { useState, useEffect } from 'react';
import { Route, Routes, Navigate, Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // Fixed incorrect destructuring
import axios from 'axios';
import './App.css';
import MedicineSearch from './components/MedicineSearch';
import AdminPanel from './components/AdminPanel';
import Signup from './components/Signup'; // Correct import
import Login from './components/Login';
import ProductDetails from './components/ProductDetails';
import ProceedWithPurchase from './components/ProceedWithPurchase';
import AdminPurchases from './components/AdminPurchases';

function App() {
  const token = localStorage.getItem('token');
  let isAdmin = false;
  let isLoggedIn = false;

  if (token) {
    const decodedToken = jwtDecode(token);
    isAdmin = decodedToken.role === 'admin';
    isLoggedIn = true;
  }

  const [query, setQuery] = useState('');
  const [medicineResults, setMedicineResults] = useState([]);
  const [selectedMedicine, setSelectedMedicine] = useState(null);

  const navigate = useNavigate();

  const fetchAllMedicines = async () => {
    try {
      const response = await axios.get('https://medicine-shop-backend.vercel.app/api/products');
      setMedicineResults(response.data);
    } catch (error) {
      console.error('There was an error fetching the data!', error);
    }
  };

  useEffect(() => {
    fetchAllMedicines();
  }, []);

  const handleSearchChange = (event) => {
    setQuery(event.target.value);
  };

  const handleSearch = async () => {
    if (query.trim() !== '') {
      try {
        const response = await axios.get('https://medicine-shop-backend.vercel.app/api/products/search', {
          params: { term: query },
        });
        setMedicineResults(response.data);
      } catch (error) {
        console.error('There was an error fetching the data!', error);
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.reload();
  };

  const handleBuyClick = (medicine) => {
    setSelectedMedicine(medicine);
    navigate('/product-details');
  };

  return (
    <div>
      <nav>
        <div className="nav-left">
          <Link to="/" onClick={fetchAllMedicines}>Medicine Shop</Link>
        </div>
        <div className="nav-right">
          {isAdmin && <Link to="/admin">Admin Panel</Link>}
          {isAdmin && <Link to="/admin-purchases">Purchases</Link>}
          {isLoggedIn ? (
            <button onClick={handleLogout}>Logout</button>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/signup">Sign Up</Link> {/* Link to Signup */}
            </>
          )}
        </div>
      </nav>
      <Routes>
        <Route
          path="/"
          element={
            <MedicineSearch
              query={query}
              setQuery={setQuery}
              medicineResults={medicineResults}
              handleSearch={handleSearch}
              isLoggedIn={isLoggedIn}
              isAdmin={isAdmin}
              handleBuyClick={handleBuyClick}
            />
          }
        />
        {isAdmin && <Route path="/admin" element={<AdminPanel />} />}
        {isAdmin && <Route path="/admin-purchases" element={<AdminPurchases />} />}
        <Route path="/signup" element={<Signup />} /> {/* Signup Route */}
        <Route path="/login" element={<Login />} />
        <Route
          path="/product-details"
          element={<ProductDetails medicine={selectedMedicine} />}
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}

export default App;
