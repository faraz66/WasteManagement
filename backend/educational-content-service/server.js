const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();
const PORT = process.env.PORT || 3003;

// Enable CORS for all requests
app.use(cors({
  origin: ['http://localhost:5177', 'http://localhost:5176', 'http://localhost:5175', 'http://localhost:5174', 'http://localhost:5173', 'http://localhost:3004', 'http://localhost:3000', 'http://localhost:3003'],
  credentials: true
}));

app.use(express.json());

// Routes would go here when implemented
// const educationRoutes = require('./routes/educationRoutes');
// app.use('/api/education', educationRoutes);

app.get('/', (req, res) => {
  res.send('Educational Content Service is running!');
});

// Basic educational content endpoint for now
app.get('/api/education/articles', (req, res) => {
  res.json([
    {
      id: 1,
      title: 'Proper Waste Sorting Techniques',
      content: 'Learn how to properly sort your waste for maximum recycling efficiency...',
      category: 'Recycling'
    },
    {
      id: 2,
      title: 'Composting at Home',
      content: 'Start your own composting system at home with these simple steps...',
      category: 'Composting'
    },
    {
      id: 3,
      title: 'Reducing Plastic Waste',
      content: 'Practical tips to reduce plastic consumption in your daily life...',
      category: 'Reduction'
    }
  ]);
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`Educational Content Service running on port ${PORT}`);
});