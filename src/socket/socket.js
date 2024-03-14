
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

  ws.send("Hello, client!");
});


// const io = new Server(server, {
//   cors: { origin: "*" },
//   transports: ['websocket']
// });
// const userSocketMap = {};
// io.on("connection", (socket) => {
//   console.log("connected", socket.id);
//   socket.on("chat message", (msg) => {
//     console.log("message: " + msg);
//   });
//   const userId = socket.handshake.query.userId;
//   if (userId !== "undefined") userSocketMap[userId] = socket.id;
//   //io.emit () is used to send events to all  the connenct client
//   io.emit(" CreateNewChat", Object.keys(userSocketMap));
//   userSocketMap[socket.id] = true;

//   // //   // Gửi thông báo cho tất cả client về trạng thái hoạt động
//   io.emit("getOnlineUser", { userId: socket.id, active: true });
//   socket.on("disconnect", () => {
//     console.log("user disconnected");
//     socket.disconnect();
//     delete userSocketMap[userId];
//     io.emit(" getOnlineUser", Object.keys(userSocketMap));
//   });
// });
export { app, server };

