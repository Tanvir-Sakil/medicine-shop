import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminPurchases.css'; // Add some CSS for table styling

function AdminPurchases() {
  const [purchases, setPurchases] = useState([]);

  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        const response = await axios.get('http://localhost:5003/api/purchases');
        setPurchases(response.data);
      } catch (error) {
        console.error('Error fetching purchase data:', error);
      }
    };

    fetchPurchases();
  }, []);

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
              <th>Medicine</th>
              <th>Price</th>
              <th>Total Price</th> {/* Added column for total price */}
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {purchases.map((purchase) => (
              <tr key={purchase._id}> {/* Use _id for unique key */}
                <td>{purchase._id}</td> {/* Use _id as the identifier */}

                {/* Customer Details */}
                <td>{purchase.customerName}</td>
                <td>{purchase.email}</td>
                <td>{purchase.address}</td>
                <td>{purchase.postalCode}</td>

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
                      <p>${medicine?.price}</p>
                    </div>
                  ))}
                </td>

                {/* Total Price */}
                <td>${purchase.totalAmount}</td> {/* Display totalAmount */}

                {/* Date */}
                <td>{new Date(purchase.date).toLocaleString()}</td> {/* Format the date */}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AdminPurchases;
