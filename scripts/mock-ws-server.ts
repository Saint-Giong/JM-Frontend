import { Server } from 'socket.io';

const PORT = 4000;
const io = new Server(PORT, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

console.log(`[Mock WS] Server started on port ${PORT}`);

io.on('connection', (socket) => {
  console.log(`[Mock WS] Client connected: ${socket.id}`);

  // Send a welcome notification
  socket.emit('notification', {
    id: 'welcome-1',
    title: 'Welcome to Realtime!',
    message: 'You are now connected to the mock WebSocket server.',
    type: 'info',
    createdAt: new Date().toISOString(),
  });

  socket.on('notification:read', (data) => {
    console.log(`[Mock WS] Notification read: ${data.id}`);
  });

  socket.on('test:notification', () => {
    console.log(
      `[Mock WS] Test notification triggered by client: ${socket.id}`
    );
    io.emit('notification', {
      id: `test-${Date.now()}`,
      title: 'Test Notification',
      message: 'This is a test notification triggered from the UI.',
      type: 'warning',
      createdAt: new Date().toISOString(),
    });
  });

  socket.on('disconnect', () => {
    console.log(`[Mock WS] Client disconnected: ${socket.id}`);
  });
});

// Periodically send mock notifications
setInterval(() => {
  const id = Math.random().toString(36).substring(7);
  console.log(`[Mock WS] Sending periodic notification: ${id}`);
  io.emit('notification', {
    id,
    title: 'New Applicant Match',
    message: 'A new applicant matches your search criteria.',
    type: 'success',
    createdAt: new Date().toISOString(),
  });
}, 30000);

// Simple matching applicant event
setInterval(() => {
  const id = Math.random().toString(36).substring(7);
  io.emit('matching_applicant', {
    id,
    name: 'John Doe',
    role: 'Senior Frontend Engineer',
    matchScore: 95,
  });
}, 45000);
