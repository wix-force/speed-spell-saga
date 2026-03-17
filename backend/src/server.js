const http = require('http');
const { Server } = require('socket.io');
const app = require('./app');
const connectDB = require('./config/db');
const { port, clientUrl } = require('./config/env');
const setupSockets = require('./sockets');

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: clientUrl, methods: ['GET', 'POST'] },
});

setupSockets(io);

// Make io accessible to routes if needed
app.set('io', io);

connectDB().then(() => {
  server.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`);
  });
});
