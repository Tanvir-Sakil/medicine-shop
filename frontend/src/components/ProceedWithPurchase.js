import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './ProceedWithPurchase.css';

function ProceedWithPurchase({ selectedMedicine }) {
  const navigate = useNavigate();

  // Declare state variables
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    postalCode: '',
    mobileNumber: '',
    quantity: 1,
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

  // Check if selectedMedicine is null or undefined
  if (!selectedMedicine) {
    navigate('/'); // Redirect to homepage if no medicine selected
    return null;
  }

  // Calculate total amount
  const totalAmount = selectedMedicine.price * formData.quantity;

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    
    try {
      const purchaseData = {
        customerName: formData.name,
        email: formData.email,
        address: formData.address,
        postalCode: formData.postalCode,
        mobileNumber: formData.mobileNumber,
        medicineDetails: [
          {
            name: selectedMedicine.name,
            price: selectedMedicine.price,
            quantity: formData.quantity,
          }
        ],
        totalAmount: totalAmount,
      };
  
      await axios.post('http://localhost:5003/api/purchase', purchaseData);
  
      setPaymentSuccess(true);
    } catch (error) {
      console.error('Error saving purchase details:', error);
      alert('Failed to complete the purchase. Please try again.');
    }
  };

  // Handle logout
  const handleLogout2 = () => {
    // Clear session data and reset form
    localStorage.removeItem('userData');
    sessionStorage.removeItem('authToken');
    
    localStorage.removeItem('token');
    window.location.href = '/';
    setFormData({
      name: '',
      email: '',
      address: '',
      postalCode: '',
      mobileNumber: '',
      quantity: 1,
    });
    setPaymentSuccess(false);

    // Redirect to homepage after logout
    console.log("Logging out and navigating to home");
    navigate('/'); // Ensure navigate works
  };

  if (paymentSuccess) {
    return (
      <div className="payment-success">
        <h2>Payment Successful!</h2>
        <p>Thank you for purchasing {selectedMedicine.name}.</p>
        <button onClick={() => navigate('/')}>Go Back to Home</button>
        <button onClick={handleLogout2} >Logout</button>
      </div>
    );
  }

  return (
    <div className="proceed-with-purchase">
      <h2>Proceed with Purchase</h2>
      <p><strong>Item:</strong> {selectedMedicine.name}</p>
      <p><strong>Price:</strong> ৳{selectedMedicine.price}</p>

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
          <label htmlFor="mobileNumber">Mobile Number</label>
          <input
            type="text"
            id="mobileNumber"
            name="mobileNumber"
            value={formData.mobileNumber}
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
            value={formData.quantity}
            onChange={handleInputChange}
            min="1"
            required
          />
        </div>

        <div className="total-amount">
          <p><strong>Total Amount:</strong> ৳{totalAmount}</p>
        </div>

        <button type="submit">Complete Purchase</button>
      </form>
    </div>
  );
}

export default ProceedWithPurchase;
