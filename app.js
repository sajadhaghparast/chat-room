const http = require("http");

const express = require("express");
const { Server } = require("socket.io");

const app = express(); //? Request Handler Valid createServer()
const server = http.createServer(app);
const socketServer = new Server(server);

app.use(express.static("public"));

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const users = {};

socketServer.on("connection", (socket) => {
  socket.on("login", (nickname) => {
    console.log(`${nickname} Connected.`);
    users[socket.id] = nickname;
    socketServer.sockets.emit("online", users);
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected.`);
    delete users[socket.id];
    socketServer.emit("online", users);
  });

  socket.on("chat message", (data) => {
    socketServer.sockets.emit("chat message", data);
  });

  socket.on("typing", (data) => {
    socket.broadcast.emit("typing", data);
  });
});
