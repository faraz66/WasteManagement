const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');
const path = require('path');
const { createServer } = require('http');
const { Server } = require('socket.io');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: ['http://localhost:5174', 'http://localhost:5173', 'http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
  }
});

const PORT = process.env.COMMUNITY_SERVICE_PORT || 3004;

// Security middleware
app.use(helmet());
app.use(compression());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // limit each IP to 1000 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// CORS configuration
app.use(cors({
  origin: ['http://localhost:5174', 'http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging
app.use(morgan('combined'));

// Static files for uploaded media
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
const feedRoutes = require('./src/routes/feedRoutes');
const postRoutes = require('./src/routes/postRoutes');
const userRoutes = require('./src/routes/userRoutes');
const groupRoutes = require('./src/routes/groupRoutes');
const challengeRoutes = require('./src/routes/challengeRoutes');
const interactionRoutes = require('./src/routes/interactionRoutes');

app.use('/api/feed', feedRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/users', userRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/challenges', challengeRoutes);
app.use('/api/interactions', interactionRoutes);

// Health check endpoint
app.get('/', (req, res) => {
  res.json({
    service: 'EcoWaste Community Service',
    status: 'running',
    version: '1.0.0',
    features: [
      'Personalized Feed Algorithm',
      'Location-based Content',
      'Real-time Interactions',
      'Community Groups',
      'Sustainability Challenges',
      'Achievement System'
    ],
    timestamp: new Date().toISOString()
  });
});

// Socket.IO for real-time features
io.on('connection', (socket) => {
  console.log(`🔌 User connected: ${socket.id}`);

  // Join user to their personal room for notifications
  socket.on('join_user_room', (userId) => {
    socket.join(`user_${userId}`);
    console.log(`👤 User ${userId} joined personal room`);
  });

  // Join location-based rooms for local content
  socket.on('join_location_room', (locationData) => {
    const { city, country } = locationData;
    const roomName = `location_${city}_${country}`.toLowerCase().replace(/\s+/g, '_');
    socket.join(roomName);
    console.log(`📍 User joined location room: ${roomName}`);
  });

  // Join interest-based rooms
  socket.on('join_interest_rooms', (interests) => {
    interests.forEach(interest => {
      const roomName = `interest_${interest}`.toLowerCase().replace(/\s+/g, '_');
      socket.join(roomName);
    });
    console.log(`🎯 User joined interest rooms: ${interests.join(', ')}`);
  });

  // Handle real-time post interactions
  socket.on('post_interaction', (data) => {
    const { postId, userId, type, postAuthorId } = data;
    
    // Notify post author of interaction
    if (postAuthorId !== userId) {
      io.to(`user_${postAuthorId}`).emit('interaction_notification', {
        type,
        postId,
        userId,
        timestamp: new Date().toISOString()
      });
    }

    // Broadcast to interested users
    socket.broadcast.emit('post_updated', { postId, type });
  });

  // Handle new post notifications
  socket.on('new_post', (postData) => {
    const { category, location, authorId } = postData;
    
    // Notify users interested in this category
    if (category) {
      socket.broadcast.to(`interest_${category}`).emit('new_post_notification', postData);
    }
    
    // Notify users in the same location
    if (location && location.city && location.country) {
      const roomName = `location_${location.city}_${location.country}`.toLowerCase().replace(/\s+/g, '_');
      socket.broadcast.to(roomName).emit('local_post_notification', postData);
    }
  });

  socket.on('disconnect', () => {
    console.log(`🔌 User disconnected: ${socket.id}`);
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('🚨 Community Service Error:', err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Community service route not found',
    availableEndpoints: [
      'GET /api/feed - Get personalized feed',
      'POST /api/posts - Create new post',
      'GET /api/posts - Get posts with filters',
      'POST /api/interactions - Record user interactions',
      'GET /api/groups - Get community groups',
      'GET /api/challenges - Get sustainability challenges'
    ]
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('✅ Community service shut down complete');
    process.exit(0);
  });
});

server.listen(PORT, () => {
  console.log(`🌱 EcoWaste Community Service running on port ${PORT}`);
  console.log(`🚀 Real-time features enabled with Socket.IO`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Available at: http://localhost:${PORT}`);
});

module.exports = { app, io };
