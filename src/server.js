#!/usr/bin/env node

const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const args = require('args-parser')(process.argv);

console.log(args);

var port = args.port;
var artserver = args.artserver;
var listen = args.listen;

if (artserver == undefined){
  artserver = "http://localhost:9000";
}
if (port == undefined){
  port = 3000;
}
if (listen == undefined){
  listen = '127.0.0.1';
}

console.log('artserver (cors): ', artserver);

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: artserver,
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



server.listen(port, listen, () => {  console.log('listening on ',listen,':', port);});

