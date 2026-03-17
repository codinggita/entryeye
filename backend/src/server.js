const http = require('http');
const { Server } = require('socket.io');
const config = require('./config/env');
const app = require('./app');
const connectDB = require('./config/db');

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Attach io to app for use in controllers
app.set('socketio', io);

// Socket.io Connection Logic
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Start Server
const startServer = async () => {
  try {
    console.log('Starting server...');
    
    // Connect to MongoDB
    console.log('Connecting DB...');
    await connectDB();

    const PORT = config.port || 5000;
    
    server.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on port ${PORT}`);
      console.log('Routes loaded...');
    });
  } catch (error) {
    console.error('Failed to start server:', error);
  }
};

startServer();
