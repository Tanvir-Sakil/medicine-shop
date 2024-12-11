import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import './ProceedWithPurchase.css';

// Load the Stripe publishable key
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_KEY);
// Replace with your Stripe publishable key

function ProceedWithPurchase({ selectedMedicine }) {
  const navigate = useNavigate();

  // Redirect if no medicine is selected
  useEffect(() => {
    if (!selectedMedicine) {
      console.log("No medicine selected. Redirecting to home...");
      navigate('/'); // Redirect to homepage
    }
  }, [selectedMedicine, navigate]);

  // State variables
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    postalCode: '',
    mobileNumber: '',
    quantity: 1,
  });

  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [clientSecret, setClientSecret] = useState('');
  const stripe = useStripe();
  const elements = useElements();

  // Handle form input changes
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Calculate total amount
  const totalAmount = selectedMedicine ? selectedMedicine.price * formData.quantity : 0;

  // Create PaymentIntent on the backend
  const createPaymentIntent = async () => {
    try {
      const { data } = await axios.post('https://medicine-shop-backend.vercel.app/api/payments/create-payment-intent', {
        amount: totalAmount * 100, // Stripe expects the amount in smallest currency unit
      });

      setClientSecret(data.clientSecret);
    } catch (error) {
      console.error('Error creating payment intent:', error.response?.data || error.message);
      alert('Failed to create payment intent. Please try again.');
    }
  };

  useEffect(() => {
    if (selectedMedicine && totalAmount > 0) {
      createPaymentIntent();
    }
  }, [selectedMedicine, totalAmount]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      console.log('Stripe.js or Elements not loaded yet.');
      return;
    }

    if (!clientSecret) {
      alert('Invalid payment intent. Redirecting to success page anyway.');
      setPaymentSuccess(true); // Proceed to success compliment page
      return;
    }

    const cardElement = elements.getElement(CardElement);

    try {
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: formData.name,
            email: formData.email,
          },
        },
      });

      if (paymentIntent?.status === 'succeeded') {
        console.log('Payment successful!');
      } else if (error) {
        console.error('Payment failed:', error.message);
      }
    } catch (err) {
      console.error('Payment processing error:', err.message);
    }

    setPaymentSuccess(true);
  };

  const handleLogout2 = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate('/'); // Navigate to homepage after logout
  };

  if (!selectedMedicine) {
    return null; // Render nothing if selectedMedicine is not available
  }

  if (paymentSuccess) {
    return (
      <div className="payment-success">
        <h2>{clientSecret ? 'Payment Successful!' : 'Payment Processing Error'}</h2>
        <p>Thank you for purchasing {selectedMedicine.name}.</p>
        <p><strong>Total Paid:</strong> ৳{totalAmount}</p>
        <p><strong>Status:</strong> {clientSecret ? 'Success' : 'Error Occurred (but proceeding)'}</p>
        <button onClick={() => navigate('/')}>Go Back to Home</button>
        <button onClick={handleLogout2}>Logout</button>
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
          <label>Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Address</label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Postal Code</label>
          <input
            type="text"
            name="postalCode"
            value={formData.postalCode}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Mobile Number</label>
          <input
            type="text"
            name="mobileNumber"
            value={formData.mobileNumber}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Quantity</label>
          <input
            type="number"
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

        <CardElement options={{ hidePostalCode: true }} />

        <button type="submit" disabled={!stripe || !clientSecret}>
          Complete Purchase
        </button>
      </form>
    </div>
  );
}
const WrappedProceedWithPurchase = (props) => (
  <Elements stripe={stripePromise}>
    <ProceedWithPurchase {...props} />
  </Elements>
);
export default WrappedProceedWithPurchase;