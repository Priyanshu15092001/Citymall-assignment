const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const memeRoutes = require('./routes/memeRoutes');
require('dotenv').config();

const app = express();
const server = http.createServer(app); // for socket.io

const io = new Server(server, {
  cors: { origin: "*" },
  methods: ["GET", "POST"]
});
app.use(cors({ origin: "*", methods: "GET,POST" }));
app.use(express.json());

// Routes
app.use('/', memeRoutes);

// Handle socket connection
io.on('connection', (socket) => {
  console.log("🔌 User connected:", socket.id);
});

app.set("io", io); // so controllers can emit events

server.listen(5000, () => {
  console.log('Server is running on http://localhost:5000');
});
