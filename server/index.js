// Main server entry point for Robotics Telemetry Dashboard

const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const socketIo = require('socket.io');
const robotRoutes = require('./routes/robots');
const authRoutes = require('./routes/auth');
const { authenticateSocket } = require('./middleware/auth');
const { startTelemetrySimulation } = require('./telemetrySimulator');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT'],
  },
});

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/robotics_dashboard';

app.use(cors());
app.use(express.json());

// Auth route
app.use('/api/auth', authRoutes);

// REST API routes
app.use('/api/robots', robotRoutes);

// WebSocket authentication
io.use(authenticateSocket);

io.on('connection', (socket) => {
  console.log('WebSocket client connected:', socket.id);
  // Telemetry events will be emitted by the simulator
});

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('MongoDB connected');
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      // Start telemetry simulation after server is up
      startTelemetrySimulation(io);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });
