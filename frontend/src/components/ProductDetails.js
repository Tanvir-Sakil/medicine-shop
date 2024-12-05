import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ProductDetails.css';

function ProductDetails({ medicine }) {
  const navigate = useNavigate();

  if (!medicine) {
    return (
      <div>
        <p>No product selected.</p>
        <button onClick={() => navigate('/')}>Go Back</button>
      </div>
    );
  }

  return (
    <div className="product-details">
      <h2>{medicine.name}</h2>
      <img src={medicine.imageUrl} alt={medicine.name} />
      <p>{medicine.description}</p>
      <p><strong>Price: ${medicine.price}</strong></p>
      <button onClick={() => navigate('/')}>Back to Search</button>
      <button onClick={() => navigate('/proceed-with-purchase')}>
  Proceed with Purchase</button>
    </div>
  );
}

export default ProductDetails;
