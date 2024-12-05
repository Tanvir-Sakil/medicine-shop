import React from 'react';
import './MedicineSearch.css';

function MedicineSearch({ query, setQuery, medicineResults, handleSearch, isLoggedIn, isAdmin, handleBuyClick }) {
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
              <p>Price: ৳{medicine.price}</p>
              {/* Show Buy button only if the user is logged in and not an admin */}
              {isLoggedIn && !isAdmin && (
                <button onClick={() => handleBuyClick(medicine)}>Buy</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MedicineSearch;
