const express = require('express');
const router = express.Router();
const Purchase = require('../models/Purchase');

// API to save purchase details
router.post('/purchase', async (req, res) => {
  try {
    const { customerName, email, address, medicineDetails, totalAmount } = req.body;

    if (!customerName || !email || !address || !medicineDetails || !totalAmount) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const newPurchase = new Purchase({
      customerName,
      email,
      address,
      medicineDetails,
      totalAmount,
    });

    await newPurchase.save();

    res.status(201).json({ message: 'Purchase saved successfully', purchase: newPurchase });
  } catch (error) {
    console.error('Error saving purchase:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// API to fetch all purchase details (for admin)
router.get('/purchases', async (req, res) => {
  try {
    const purchases = await Purchase.find();
    res.json(purchases);
  } catch (error) {
    console.error('Error fetching purchases:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
