// Socket.IO server setup
const { Server: SocketIOServer } = require('socket.io');

let io = null;

function getIOInstance() {
  return io || global.__socketIO || null;
}

function initializeSocket(server) {
  if (io) {
    return io;
  }

  io = new SocketIOServer(server, {
    cors: {
      origin: '*', // Allow all origins for public access
      methods: ['GET', 'POST'],
      credentials: false, // Set to false for public access
    },
    path: '/socket.io',
    allowEIO3: true, // Allow Engine.IO v3 clients
    // Connection settings to maintain persistent connections
    pingTimeout: 60000, // 60 seconds - how long to wait for pong before considering connection dead
    pingInterval: 25000, // 25 seconds - how often to ping clients
    transports: ['websocket', 'polling'], // Prefer websocket, fallback to polling
    upgradeTimeout: 10000, // 10 seconds for transport upgrade
  });

  io.on('connection', (socket) => {
    console.log('✅ Client connected:', socket.id);
    console.log('📊 Total connected clients:', io.sockets.sockets.size);
    console.log('🔌 Transport:', socket.conn.transport.name);

    // Automatically join reviews room for all connections (public access)
    socket.join('reviews');
    const roomSize = io.sockets.adapter.rooms.get('reviews')?.size || 0;
    console.log(`✅ Client ${socket.id} automatically joined reviews room. Room size: ${roomSize}`);

    // Test event - respond to client pings
    socket.on('ping', (callback) => {
      console.log('💓 Received ping from', socket.id);
      if (typeof callback === 'function') {
        callback('pong');
      } else {
        // If no callback, just acknowledge
        socket.emit('pong');
      }
    });

    // Handle transport upgrade (polling -> websocket)
    socket.conn.on('upgrade', () => {
      console.log(`⬆️ Client ${socket.id} upgraded to ${socket.conn.transport.name}`);
    });

    // Allow manual join (for backwards compatibility)
    socket.on('join:reviews', (callback) => {
      if (!socket.rooms.has('reviews')) {
        socket.join('reviews');
      }
      const roomSize = io.sockets.adapter.rooms.get('reviews')?.size || 0;
      console.log(`Client ${socket.id} joined reviews room. Room size: ${roomSize}`);
      if (typeof callback === 'function') {
        callback({ success: true, roomSize });
      }
    });

    // Fallback bridge: when review is created from client flow, fan out to all users.
    socket.on('review:created:client', (review) => {
      if (!review || typeof review !== 'object' || !review.id) {
        return;
      }
      io.to('reviews').emit('review:created', review);
    });

    // Leave room for reviews
    socket.on('leave:reviews', () => {
      socket.leave('reviews');
      const roomSize = io.sockets.adapter.rooms.get('reviews')?.size || 0;
      console.log(`Client ${socket.id} left reviews room. Room size: ${roomSize}`);
    });

    socket.on('disconnect', (reason) => {
      console.log('❌ Client disconnected:', socket.id, 'reason:', reason);
      console.log('📊 Remaining connected clients:', io.sockets.sockets.size);
      const roomSize = io.sockets.adapter.rooms.get('reviews')?.size || 0;
      console.log(`📊 Clients in reviews room: ${roomSize}`);
    });

    // Handle connection errors
    socket.on('error', (error) => {
      console.error('❌ Socket error for', socket.id, ':', error);
    });
  });

  // Share instance for API routes running in the same process.
  global.__socketIO = io;
  return io;
}

function getSocketIO() {
  return getIOInstance();
}

// Helper function to emit review events
function emitReviewCreated(review) {
  const ioInstance = getIOInstance();
  if (!ioInstance) {
    console.error('Socket.IO server not initialized! Cannot emit review:created event');
    return;
  }
  
  console.log('=== Emitting review:created event ===');
  console.log('Review ID:', review.id);
  console.log('Review title:', review.title);
  
  const reviewsRoom = ioInstance.sockets.adapter.rooms.get('reviews');
  const clientsInRoom = reviewsRoom ? reviewsRoom.size : 0;
  const totalClients = ioInstance.sockets.sockets.size;
  
  console.log(`Total connected clients: ${totalClients}`);
  console.log(`Clients in reviews room: ${clientsInRoom}`);
  
  if (clientsInRoom === 0) {
    console.warn('WARNING: No clients in reviews room! Event will not be received by anyone.');
  }
  
  // Emit to the reviews room
  ioInstance.to('reviews').emit('review:created', review);
  
  // Also log all socket IDs in the room for debugging
  if (reviewsRoom) {
    const socketIds = Array.from(reviewsRoom);
    console.log('Socket IDs in reviews room:', socketIds);
  }
  
  console.log('Review created event emitted successfully');
}

function emitReviewUpdated(review) {
  const ioInstance = getIOInstance();
  if (ioInstance) {
    ioInstance.to('reviews').emit('review:updated', review);
  }
}

function emitReviewVoteUpdated(reviewId, helpfulCount) {
  const ioInstance = getIOInstance();
  if (ioInstance) {
    console.log('Emitting review:vote:updated event for review:', reviewId, 'count:', helpfulCount);
    const clientsInRoom = ioInstance.sockets.adapter.rooms.get('reviews');
    console.log(`Clients in reviews room: ${clientsInRoom ? clientsInRoom.size : 0}`);
    ioInstance.to('reviews').emit('review:vote:updated', { reviewId, helpfulCount });
    console.log('Vote updated event emitted');
  } else {
    console.error('Socket.IO server not initialized! Cannot emit review:vote:updated event');
  }
}

module.exports = {
  initializeSocket,
  getSocketIO,
  emitReviewCreated,
  emitReviewUpdated,
  emitReviewVoteUpdated,
};
