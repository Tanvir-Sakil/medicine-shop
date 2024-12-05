const mongoose = require('mongoose');

const PurchaseSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  email: { type: String, required: true },
  address: { type: String, required: true },
  postalCode: { type: String, required: true },  // Ensure postalCode is defined
  mobileNumber: { type: String, required: true }, // New field for mobile number
  medicineDetails: [
    {
      name: { type: String, required: true },
      price: { type: Number, required: true },
      quantity: { type: Number, required: true },
    },
  ],
  totalAmount: { type: Number, required: true },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Purchase', PurchaseSchema);
