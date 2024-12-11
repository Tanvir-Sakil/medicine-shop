import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminPurchases.css'; // Add some CSS for table styling

function AdminPurchases() {
  const [purchases, setPurchases] = useState([]);

  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        const response = await axios.get('https://medicine-shop-backend.vercel.app/api/purchases');
        setPurchases(response.data);
      } catch (error) {
        console.error('Error fetching purchase data:', error);
      }
    };

    fetchPurchases();
  }, []);

  // Handle deletion of a purchase
  const handleDelete = async (purchaseId) => {
    try {
      // Send DELETE request to remove the purchase from the backend
      await axios.delete(`https://medicine-shop-backend.vercel.app/api/purchases/${purchaseId}`);
      
      // Remove the deleted purchase from the state
      setPurchases((prevPurchases) =>
        prevPurchases.filter((purchase) => purchase._id !== purchaseId)
      );
      
      alert('Purchase deleted successfully!');
    } catch (error) {
      console.error('Error deleting purchase:', error);
      alert('Failed to delete purchase.');
    }
  };

  return (
    <div className="admin-purchases">
      <h2>Customer Purchase Details</h2>
      {purchases.length === 0 ? (
        <p>No purchases available.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Customer Name</th>
              <th>Email</th>
              <th>Address</th>
              <th>Postal Code</th>
              <th>Mobile Number</th>
              <th>Medicine</th>
              <th>Price</th>
              <th>Total Price</th>
              <th>Date</th>
              <th>Actions</th> {/* Add Actions Column for the Delete Button */}
            </tr>
          </thead>
          <tbody>
            {purchases.map((purchase) => (
              <tr key={purchase._id}>
                <td>{purchase._id}</td>
                <td>{purchase.customerName}</td>
                <td>{purchase.email}</td>
                <td>{purchase.address}</td>
                <td>{purchase.postalCode}</td>
                <td>{purchase.mobileNumber}</td>

                {/* Medicine Details */}
                <td>
                  {purchase.medicineDetails?.map((medicine, index) => (
                    <div key={index}>
                      <p>{medicine?.name}</p>
                    </div>
                  ))}
                </td>

                <td>
                  {purchase.medicineDetails?.map((medicine, index) => (
                    <div key={index}>
                      <p>৳{medicine?.price}</p>
                    </div>
                  ))}
                </td>

                <td>${purchase.totalAmount}</td>
                <td>{new Date(purchase.date).toLocaleString()}</td>

                {/* Delete Button */}
                <td>
                  <button onClick={() => handleDelete(purchase._id)} className="delete-btn">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AdminPurchases;
