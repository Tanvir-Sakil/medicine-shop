// routes/purchases.js
const express = require('express');
const router = express.Router();
const Purchase = require('../models/Purchase');

// Purchase POST route
router.post('/', async (req, res) => {
  try {
    const { customerName, email, address, postalCode, mobileNumber, medicineDetails, totalAmount } = req.body;

    if (!customerName || !email || !address || !postalCode || !mobileNumber || !medicineDetails || !totalAmount) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const newPurchase = new Purchase({
      customerName,
      email,
      address,
      postalCode,
      mobileNumber,
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

// Route to fetch all purchases (admin)
router.get('/', async (req, res) => {
  try {
    const purchases = await Purchase.find();
    res.json(purchases);
  } catch (error) {
    console.error('Error fetching purchases:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const purchase = await Purchase.findByIdAndDelete(id);
    if (!purchase) {
      return res.status(404).send('Purchase not found');
    }
    res.status(200).send('Purchase deleted');
  } catch (error) {
    res.status(500).send('Server error');
  }
});


// Test route to verify purchase route is working
router.get('/test', (req, res) => {
  res.json({ message: 'Purchase route is working!' });
});

module.exports = router;
