import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminPanel.css';

function AdminPanel() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');  // Added state for price
  const [imageFile, setImageFile] = useState(null);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch existing products on initial load
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5003/products/search', {
          params: { term: '' }, // Fetch all products
        });
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products", error);
        alert('Failed to fetch products. Please try again later.');
      }
    };

    fetchProducts();
  }, []);

  // Handle image file input
  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  // Add a new product
  const handleAddProduct = async () => {
    if (!name.trim() || !description.trim() || !imageFile || !price.trim()) {  // Check for price
      alert('Please fill out all fields and upload an image.');
      return;
    }

    try {
      setIsLoading(true); // Show loading indicator
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('name', name);
      formData.append('description', description);
      formData.append('price', price);  // Add price to form data
      formData.append('image', imageFile);

      const response = await axios.post(
        'http://localhost:5003/products',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      alert(response.data.message);
      setProducts([...products, response.data.product]); // Add new product to the list
      // Reset input fields
      setName('');
      setDescription('');
      setPrice('');
      setImageFile(null);
    } catch (error) {
      console.error("There was an error adding the product!", error);
      alert('Failed to add product. Please try again.');
    } finally {
      setIsLoading(false); // Hide loading indicator
    }
  };

  // Delete a product
  const handleDeleteProduct = async (id) => {
    console.log({id});
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      setIsLoading(true); // Show loading indicator
      const token = localStorage.getItem('token');

      const response = await axios.delete(`http://localhost:5003/products/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert(response.data.message);
      setProducts(products.filter((product) => product._id !== id)); // Remove product from the list
    } catch (error) {
      console.error("There was an error deleting the product!", error);
      alert('Failed to delete product. Please try again.');
    } finally {
      setIsLoading(false); // Hide loading indicator
    }
  };

  return (
    <div className="admin-panel-container">
      <h2>Add New Product</h2>
      <div className="form-group">
        <input
          type="text"
          placeholder="Product Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          type="text"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}  // Bind price input
        />
        <input type="file" onChange={handleImageChange} />
        <button onClick={handleAddProduct} disabled={isLoading}>
          {isLoading ? 'Adding...' : 'Add Product'}
        </button>
      </div>

      <h2>Existing Products</h2>
      <div className="product-list">
        {
          products.map((product) => (
            <div className="product-card" key={product._id}>
              <h3>{product.name}</h3>
              <p>{product.description}</p>
              <p><strong>Price: ৳{product.price}</strong></p>  {/* Display price */}
              <img
                src={product.imageUrl}
                alt={product.name || 'Product'}
                width="100"
              />
              <button
                onClick={() => handleDeleteProduct(product._id)}
                disabled={isLoading}
              >
                {isLoading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          ))
        }
      </div>
    </div>
  );
}

export default AdminPanel;
