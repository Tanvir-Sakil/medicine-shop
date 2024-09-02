import React, { useState } from 'react';
import axios from 'axios';
import './MedicineSearch.css';

function MedicineSearch() {
  const [query, setQuery] = useState('');
  const [medicineResults, setMedicineResults] = useState([]);

  const handleSearchChange = (event) => {
    setQuery(event.target.value);
  };

  const handleSearch = async () => {
    if (query.trim() !== '') {
      try {
        const response = await axios.get('http://localhost:5000/products/search', {
          params: { term: query },
        });
        setMedicineResults(response.data);
      } catch (error) {
        console.error("There was an error fetching the data!", error);
      }
    }
  };

  return (
    <div className="medicine-search-container">
      <input
        type="text"
        placeholder="Search for medicine"
        value={query}
        onChange={handleSearchChange}
      />
      <button onClick={handleSearch}>Search</button>
      <div className="product-grid">
        {medicineResults.map((medicine, index) => (
          <div className="card" key={index}>
            <div className="card-content">
            <h3>{medicine.name}</h3>
            <p>{medicine.description}</p>
            <img src={medicine.imageUrl} alt={medicine.name} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MedicineSearch;
