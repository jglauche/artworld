const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");

const io = new Server(server, {
  cors: {
    origin: "http://localhost:9000",
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket) => {
  console.log('a user connected');
  let id = socket.id;
  io.to(id).emit("infoReq");

  socket.on("levelChange", (room) => {
    socket.to(room).emit("infoReq");
    socket.join(room);
  });

  socket.on("clientInfo", ([room, image, x, y, z]) => {
    console.log("got clientinfo from "+ socket.id);
    socket.to(room).emit("clientUpdate", [socket.id, room, image, x, y, z]);
  });

  socket.on("move", ([room, x, y]) => {
    socket.to(room).emit("move", [socket.id, x, y]);
  });

  socket.on("disconnecting", () => {
    socket.rooms.forEach(room => {
      console.log("sending disconnectEvent of socket "+socket.id+ " to room " +room);
      socket.to(room).emit("disconnectEvent", [socket.id]);
    });
  });

});

io.of("/").adapter.on("join-room", (room, id) => {  console.log(`socket ${id} has joined room ${room}`);});



server.listen(3000, () => {  console.log('listening on *:3000');});

