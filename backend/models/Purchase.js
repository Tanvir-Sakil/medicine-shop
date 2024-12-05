const mongoose = require('mongoose');

const PurchaseSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  email: { type: String, required: true },
  address: { type: String, required: true },
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
