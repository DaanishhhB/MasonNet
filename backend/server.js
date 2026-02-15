require('dotenv').config();
const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const cors = require('cors');
const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');

const app = express();
const server = http.createServer(app);

// Socket.IO setup with CORS and increased buffer for file transfers
const io = new Server(server, {
  cors: { origin: '*', methods: ['GET', 'POST'] },
  maxHttpBufferSize: 10e6, // 10MB for file attachments
});

// Make io accessible to routes
app.set('io', io);

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/courses', require('./routes/courses'));
app.use('/api/messages', require('./routes/messages'));
app.use('/api/posts', require('./routes/posts'));
app.use('/api/events', require('./routes/events'));
app.use('/api/study-sessions', require('./routes/studySessions'));
app.use('/api/documents', require('./routes/documents'));
app.use('/api/chatbot', require('./routes/chatbot'));
app.use('/api/mason-meets', require('./routes/masonMeets'));

// Config endpoint (returns public configuration like support email)
app.get('/api/config', (req, res) => {
  res.json({
    supportEmail: process.env.SUPPORT_EMAIL || 'support@masonnet.gmu.edu',
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Socket.IO authentication middleware
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) return next(new Error('Authentication required'));
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.userId = decoded.userId;
    next();
  } catch (err) {
    next(new Error('Invalid token'));
  }
});

// Socket.IO connection handler
io.on('connection', (socket) => {
  console.log(`🔌 User connected: ${socket.userId}`);

  // Join personal room for DM delivery
  socket.join(`user:${socket.userId}`);

  // Join/leave channel rooms
  socket.on('join-channel', (channelId) => {
    socket.join(`channel:${channelId}`);
  });

  socket.on('leave-channel', (channelId) => {
    socket.leave(`channel:${channelId}`);
  });

  // Join feed room for real-time post updates
  socket.on('join-feed', () => {
    socket.join('feed');
  });

  socket.on('disconnect', () => {
    console.log(`🔌 User disconnected: ${socket.userId}`);
  });
});

// Connect to MongoDB and start server
const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB Atlas');
    server.listen(PORT, () => {
      console.log(`🚀 MasonNet API server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });
