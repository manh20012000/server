import express from "express";
import { Router, query } from "express";
import protectRoute from "../middlewere/protectRoute.js";
import ConverStation from "../model/converStationModel.js";
import messageShamec from "../model/messageShamec.js";
import { getReciverSocketId } from "../socket/socket.js";
let MessageChat = Router();
import { io } from "../socket/socket.js";
MessageChat.post("/send/:_id", protectRoute, async (req, res) => {
  try {
    // console.log(req.params);
    const senderId = req.user._id;
    const { _id: receiverId } = req.params;
    const { message } = req.body;

    let converstation = await ConverStation.findOne({
      participants: { $all: [senderId, receiverId] },
    });
    if (!converstation) {
      converstation = await ConverStation.create({
        participants: [senderId, receiverId],
      });
    }
    console.log(message);
    // console.log("hahah item2", req.params.userId, id);
    const newMessage = new messageShamec({
      senderId,
      receiverId,
      message: message.text,
    });
    // console.log(message,'tin nhăn được gưi từ client');
    if (newMessage) {
      // console.log(newMessage.message);
      // console.log(newMessage, "tin nhăn được gưi từ client");
      // converstation.messages.push(newMessage._id);
    }
    // socket io funcition will go here
    //   await converstation.save();

    //   await newMessage.save();\
    // await Promise.all([converstation.save(), newMessage.save()]);
    const receiverSocketId = getReciverSocketId(receiverId);
    if (receiverSocketId) {
      console.log("nhay vao socket ");
      ///io.to(<socket_id></socket_id>).emit() used to send envernt to specific client
      receiverSocketId.forEach((socketId) => {
        const nesMess = {
          _id: newMessage._id,
          text: message.text,
          createdAt: message.createdAt,
          user: message.user,
        };
        // console.log(newMessage, "scpketIs", nesMess);
        io.to(socketId).emit("newMessage", nesMess);
      });
    }
    res.status(200).json({ data: newMessage });
    // console.log("hahah item", req.params._id);
  } catch (error) {
    console.log(error.message, "loi say ra");
    res.status(500).json({ message: error });
  }
});
MessageChat.get("/getMessage/:id", protectRoute, async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const senderId = req.user._id;

    const converstation = await ConverStation.findOne({
      participants: { $all: [senderId, userToChatId] },
    })
      .populate({
        path: "messages",
        options: { sort: { createdAt: -1 } }, // Sắp xếp theo thời gian tạo tăng dần (1) hoặc giảm dần (-1)
        populate: {
          path: "senderId",
          model: "user",
        },
      })
      .limit(10);

    if (!converstation) {
      return res.status(200).json([]);
    }

    const messages = converstation.messages.map((message) =>
      // console.log(message),
      ({
        _id: message._id,
        text: message.message,
        createdAt: message.createdAt,
        user: {
          _id: message.senderId._id,
          name: message.senderId.Hoten,
          avatar: message.senderId.Avatar,
          // Thêm các thông tin khác của user nếu cần
        },
      })
    );

    res.status(200).json(messages);
  } catch (error) {
    console.log(error.message, "loi say ra nhan tin nhan");
    res.status(500).json({ message: error });
  }
});
export default MessageChat;
