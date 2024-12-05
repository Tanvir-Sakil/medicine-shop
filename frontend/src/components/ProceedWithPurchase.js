import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Importing axios
import './ProceedWithPurchase.css'; // Importing CSS for styling

function ProceedWithPurchase({ selectedMedicine }) {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    postalCode: '',
    quantity: 1, // Default quantity to 1
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

  // Calculate total price
  const totalAmount = selectedMedicine.price * formData.quantity;

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    try {
      const purchaseData = {
        customerName: formData.name,
        email: formData.email,
        address: formData.address,
        medicineDetails: [
          {
            name: selectedMedicine.name,
            price: selectedMedicine.price,
            quantity: formData.quantity, // Include the quantity selected
          }
        ],
        totalAmount: totalAmount, // Send the total amount
      };
  
      await axios.post('http://localhost:5003/api/purchase', purchaseData);
  
      setPaymentSuccess(true); // Show success message
    } catch (error) {
      console.error('Error saving purchase details:', error);
      alert('Failed to complete the purchase. Please try again.');
    }
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

        <div className="form-group">
          <label htmlFor="quantity">Quantity</label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            min="1"
            value={formData.quantity}
            onChange={handleInputChange}
            required
          />
        </div>

        {/* Display Total Price */}
        <div className="total-price">
          <p><strong>Total Amount:</strong> ${totalAmount}</p>
        </div>

        <button type="submit">Confirm and Pay</button>
      </form>
    </div>
  );
}

export default ProceedWithPurchase;
