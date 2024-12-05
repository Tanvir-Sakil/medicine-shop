const express = require('express');
const Product = require('../models/Product');
const adminAuth = require('../middleware/adminAuth');
const { upload } = require('../utils/cloudinary');

const router = express.Router();

// Fetch all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find(); // Fetch all products from the database
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error });
  }
});

// Search products
router.get('/search', async (req, res) => {
  const { term } = req.query;
  const products = await Product.find({ name: { $regex: term, $options: 'i' } });
  res.json(products);
});

// Add new product
router.post('/', adminAuth, upload.single('image'), async (req, res) => {
  try {
    const { name, description, price } = req.body; // Include price
    const imageUrl = req.file.path;

    const newProduct = new Product({ name, description, imageUrl, price });
    await newProduct.save();
    res.status(201).json({ message: 'Product added successfully', product: newProduct });
  } catch (error) {
    res.status(500).json({ message: 'Error adding product', error });
  }
});

// Delete a product
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findByIdAndDelete(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product', error });
  }
});

// Buy a product (mark as purchased)
router.post('/buy/:id', async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // If already purchased, return message
    if (product.isPurchased) {
      return res.status(400).json({ message: 'This product has already been purchased.' });
    }

    // Mark product as purchased
    product.isPurchased = true;
    await product.save();
    
    res.status(200).json({ message: 'Product purchased successfully', product });
  } catch (error) {
    res.status(500).json({ message: 'Error buying product', error });
  }
});

module.exports = router;
