import {Server} from "socket.io";
import http from "http";
import express from "express";
import jwt from "jsonwebtoken";
import {emitToUser, pushSocketIDToArray, removeSocketIDFromArray} from "../ultils/socketUtils.js";
const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*'
  },
});

export const getReciverSocketId = (receiverId) => {
  return userSocketMap[receiverId];
};
const userSocketMap = {}; // {userId:socketId}

io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (!err) {
        socket.userId = decoded.userId;
      }
    });
  }
  return next();
});

let clients = {};
io.on("connection", (socket) => {
  console.log(`⚡: ${socket.id} user just connected`);

  socket.on('disconnect', () => {
    console.log('A user disconnected');
    clients = removeSocketIDFromArray(
        clients,
        socket?.userId,
        socket
    );
  });

  if (!socket?.userId) {
    return;
  }
  clients = pushSocketIDToArray(clients, socket?.userId, socket.id);
  socket.on("sendMessage", (data) => {
    if (data.receiverId) {
      if (clients[data.receiverId]) {
        emitToUser(clients, data.receiverId, io, "incomingMessage", {
          ...data,
          receiverId: undefined,
        });
      }
    }
  });
});

export { app, io, server };
