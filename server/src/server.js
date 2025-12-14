// import express from 'express';
// import { createServer } from 'http';
// import { Server } from 'socket.io';
// import cors from 'cors';
// import dotenv from 'dotenv';
// import pollRoutes from './routes/pollRoutes.js';
// import { initializeSocketHandlers } from './sockets/pollHandlers.js';
// import { initializeChatHandlers } from './sockets/chatHandlers.js';

// dotenv.config();

// const app = express();
// const httpServer = createServer(app);
// const io = new Server(httpServer, {
//   cors: {
//     origin: process.env.CLIENT_URL || "http://localhost:3000",
//     methods: ["GET", "POST"],
//     credentials: true
//   }
// });

// const PORT = process.env.PORT || 5000;

// // Middleware
// app.use(cors({
//   origin: process.env.CLIENT_URL || "http://localhost:3000",
//   credentials: true
// }));
// app.use(express.json());

// // Health check endpoint
// app.get('/api/health', (req, res) => {
//   res.json({ status: 'ok', timestamp: new Date().toISOString() });
// });

// // API Routes
// app.use('/api', pollRoutes);

// // Socket.io connection handling
// io.on('connection', (socket) => {
//   console.log(`Client connected: ${socket.id}`);
  
//   // Initialize socket handlers
//   initializeSocketHandlers(socket, io);
//   initializeChatHandlers(socket, io);

//   socket.on('disconnect', () => {
//     console.log(`Client disconnected: ${socket.id}`);
//   });
// });

// // Start server
// httpServer.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });

// export { io };

import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import pollRoutes from './routes/pollRoutes.js';
import { initializeSocketHandlers } from './sockets/pollHandlers.js';
import { initializeChatHandlers } from './sockets/chatHandlers.js';

dotenv.config();

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST"],
    credentials: true
  }
});

const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true
}));
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// API routes
app.use('/api', pollRoutes);

// Socket handling
io.on('connection', (socket) => {
  console.log(`Client connected: ${socket.id}`);

  initializeSocketHandlers(socket, io);
  initializeChatHandlers(socket, io);

  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

// 🔥 IMPORTANT FOR RENDER
httpServer.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});

export { io };
