const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();
const PORT = process.env.PORT || 3002;

// Enable CORS for all requests
app.use(cors({
  origin: ['http://localhost:5177', 'http://localhost:5176', 'http://localhost:5175', 'http://localhost:5174', 'http://localhost:5173', 'http://localhost:3004', 'http://localhost:3000', 'http://localhost:3003'],
  credentials: true
}));

app.use(express.json());

// Routes
const productRoutes = require('./src/routes/productRoutes');
const cartRoutes = require('./src/routes/cartRoutes');

app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);

app.get('/', (req, res) => {
  res.send('Marketplace Service is running!');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`Marketplace Service running on port ${PORT}`);
});
