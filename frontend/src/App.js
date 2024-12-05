import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Route, Routes, Navigate, Link, useNavigate } from 'react-router-dom'; // Removed BrowserRouter
import { jwtDecode } from 'jwt-decode';
import MedicineSearch from './components/MedicineSearch';
import AdminPanel from './components/AdminPanel';
import Signup from './components/Signup';
import Login from './components/Login';
import ProductDetails from './components/ProductDetails';
import ProceedWithPurchase from './components/ProceedWithPurchase'; 
//import './App.css';
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
  const [allMedicines, setAllMedicines] = useState([]);
  const [selectedMedicine, setSelectedMedicine] = useState(null);

  const navigate = useNavigate();

  const fetchAllMedicines = async () => {
    try {
      const response = await axios.get('http://localhost:5002/products');
      setAllMedicines(response.data);
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
        const response = await axios.get('http://localhost:5002/products/search', {
          params: { term: query },
        });
        setMedicineResults(response.data);
      } catch (error) {
        console.error('There was an error fetching the data!', error);
      }
    }
  };

// Reset search to show all products
const resetSearch = async () => {
  setQuery(''); // Clear the search query

  // Fetch all medicines again
  try {
    const response = await axios.get('http://localhost:5002/products');
    setAllMedicines(response.data);
    setMedicineResults(response.data); // Reset results to show all products
  } catch (error) {
    console.error('There was an error fetching the updated data!', error);
    alert('Failed to fetch updated products. Please try again.');
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
          <Link to="/" onClick={resetSearch}>Medicine Shop</Link>
        </div>
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
        {isAdmin && <Route path="/admin" element={<AdminPanel fetchAllMedicines={fetchAllMedicines} />} />}
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/product-details"
          element={<ProductDetails medicine={selectedMedicine} />}
        />
          <Route
    path="/proceed-with-purchase"
    element={<ProceedWithPurchase selectedMedicine={selectedMedicine} />}
  />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}

export default App;
