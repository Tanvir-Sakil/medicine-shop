const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String, required: true },
  price: { type: Number, required: true }, // Price of the product
  isPurchased: { type: Boolean, default: false }, // Whether the product is purchased
});

module.exports = mongoose.model('Product', productSchema);
