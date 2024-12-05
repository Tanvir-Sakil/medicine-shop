const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5002;


app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((error) => console.error('MongoDB connection error:', error));

const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');

app.use('/api', authRoutes);
app.use('/products', productRoutes);
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
module.exports = app;
