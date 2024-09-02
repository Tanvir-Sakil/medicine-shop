const express = require('express');
const Product = require('../models/Product');
const adminAuth = require('../middleware/adminAuth');

const router = express.Router();

// Get products (accessible by all users)
router.get('/search', async (req, res) => {
  const { term } = req.query;
  const products = await Product.find({ name: { $regex: term, $options: 'i' } });
  res.json(products);
});

// Add a new product (admin only)
router.post('/', adminAuth, async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    await newProduct.save();
    res.status(201).json({ message: 'Product added successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error adding product', error });
  }
});

module.exports = router;
