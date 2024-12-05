import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ProceedWithPurchase.css'; // Importing CSS for styling

function ProceedWithPurchase({ selectedMedicine }) {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    postalCode: '',
  });

  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Handle form input changes
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = (event) => {
    event.preventDefault();
    // Simulate payment processing
    setTimeout(() => {
      setPaymentSuccess(true);
    }, 2000); // Simulate a delay for payment
  };

  if (paymentSuccess) {
    return (
      <div className="payment-success">
        <h2>Payment Successful!</h2>
        <p>Thank you for purchasing {selectedMedicine.name}.</p>
        <button onClick={() => navigate('/')}>Go Back to Home</button>
      </div>
    );
  }

  return (
    <div className="proceed-with-purchase">
      <h2>Proceed with Purchase</h2>
      <p><strong>Item:</strong> {selectedMedicine.name}</p>
      <p><strong>Price:</strong> ${selectedMedicine.price}</p>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="address">Address</label>
          <textarea
            id="address"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            required
          ></textarea>
        </div>

        <div className="form-group">
          <label htmlFor="city">City</label>
          <input
            type="text"
            id="city"
            name="city"
            value={formData.city}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="postalCode">Postal Code</label>
          <input
            type="text"
            id="postalCode"
            name="postalCode"
            value={formData.postalCode}
            onChange={handleInputChange}
            required
          />
        </div>

        <button type="submit">Confirm and Pay</button>
      </form>
    </div>
  );
}

export default ProceedWithPurchase;
