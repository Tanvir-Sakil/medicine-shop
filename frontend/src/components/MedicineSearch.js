import React from 'react';
import './MedicineSearch.css';

function MedicineSearch({ query, setQuery, medicineResults, handleSearch, isLoggedIn, isAdmin }) {
  // Handle search query change
  const handleSearchChange = (event) => {
    setQuery(event.target.value);
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
              <img src={medicine.imageUrl} alt={medicine.name} />
              <p>{medicine.description}</p>
              {/* Show "Buy" button only for logged-in non-admin users */}
              {isLoggedIn && !isAdmin && (
                <button>Buy</button>  // Only non-admin users will see this button
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MedicineSearch;
