import { Server } from "socket.io";
import http from "http";
import express from "express";
import dotenv from "dotenv";
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://192.168.188.136:3001"],
    methods: ["GET", "POST"],
  },
});
export const getReciverSocketId = (receiverId) => {
  return userSocketMap[receiverId];
};
const userSocketMap = {}; // {userId:socketId}
io.on("connection", (socket) => {
  console.log("user connected", socket);
  console.log("a user connected", socket.id);
  const userId = socket.handshake.query.userId;
  if (userId !== "undefined") userSocketMap[user] = socket.id;
  //io.emit () is used to send events to all  the connenct client
  io.emit(" getOnlineUser", Object.keys(userSocketMap));
  userSocketMap[socket.id] = true;

  // //   // Gửi thông báo cho tất cả client về trạng thái hoạt động
  io.emit("getOnlineUser", { userId: socket.id, active: true });
  socket.on("disconnect", () => {
    console.log("user disconnected");
    socket.disconnect();
    delete userSocketMap[userId];
    io.emit(" getOnlineUser", Object.keys(userSocketMap));
  });
});
export { app, io, server };
