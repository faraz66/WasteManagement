const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();
const PORT = process.env.PORT || 3001;

// Enable CORS for all requests
app.use(cors({
  origin: ['http://localhost:3004', 'http://localhost:3000', 'http://localhost:3003'],
  credentials: true
}));

app.use(express.json());

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

app.get('/', (req, res) => {
  res.send('User Service is running!');
});

app.listen(PORT, () => {
  console.log(`User Service running on port ${PORT}`);
});
