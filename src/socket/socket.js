import http from "http";
import express from "express";
import WebSocket,{ WebSocketServer } from "ws";
const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ noServer: true });
wss.on("connection", function connection(ws) {
  console.log("New WebSocket connection");

  ws.on("message", function incoming(message) {
    console.log("received: %s", message);
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
