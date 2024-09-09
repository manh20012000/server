import { Server } from "socket.io";
import http from "http";
import express from "express";
import jwt from "jsonwebtoken";
import {
  emitToUser,
  pushSocketIDToArray,
  removeSocketIDFromArray,
} from "../ultils/socketUtils.js";
import user from "../model/user.js";
const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});
let clients = {};
export const getReciverSocketId = (receiverId) => {
 
  return clients[receiverId];
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

// userId: [socketId,...]
io.on("connection", (socket) => {
  console.log(`⚡: ${socket.id} user just connected`);
  socket.on("disconnect", () => {
    console.log("A user disconnected");
    clients = removeSocketIDFromArray(clients, socket?.userId, socket);
    let listUserIdOnline = Object.keys(clients);
    socket.broadcast.emit("server-send-when-has-user-online", listUserIdOnline);
    console.log('ngat ket noi')
  });

  if (!socket?.userId) {
    return;
  }
  clients = pushSocketIDToArray(clients, socket?.userId, socket.id);
  // socket.on("sendMessage", (data) => {
  //   if (data.receiverId) {
  //     if (clients[data.receiverId]) {
  //           console.log(clients[data.receiverId])
  //       emitToUser(clients, data.receiverId, io, "incomingMessage", {
  //         ...data,
  //         receiverId: undefined,
  //       });
  //     }
  //   }
  // });
  let listUserIdOnline = Object.keys(clients);
  console.log(listUserIdOnline,'hhhhh')
  socket.emit("UserOnline", listUserIdOnline);
  // Gửi id người dùng vừa online có tất cả user khác
  socket.broadcast.emit("server-send-when-has-user-online", listUserIdOnline);
});

export { app, io, server };

// socket.on('userActive', ({ userId }) => {
//   console.log('User active:',userId);
//   // Phát lại sự kiện userActive cho tất cả các client khác
//   socket.broadcast.emit('userActive', { userId, isActive: true });
// });
// console.log(clients)
// console.log(listUserIdOnline)
// TODO: Get friend listb bang socket..UserId
// friends = [userId,...]
// friends.forEach((userId) => {
//     emitTo
// })
// const handerListOnlineFriend = async () => {
//   try {
//     const userFriend = await user.findById(socket.userId)
//     userFriend.AcceptFriend.forEach(element => {
//       console.log(element)
//       socket.emit('Status', { userId: element, status: true });
//     });
//   } catch (error) {
//     console.error(error);
//   }
// }
// handerListOnlineFriend();
// socket.emit("server-send-list-user-online", listUserIdOnline);

//socket.broadcast.emit("server-send-when-has-user-online", socket.request.user._id);
