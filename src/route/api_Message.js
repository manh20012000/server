import express from "express";
import { Router, query } from "express";
import protectRoute from "../middlewere/protectRoute.js";
import converStationModel from "../model/converStationModel.js";
import messageShamec from "../model/messageShamec.js";
import { getReciverSocketId } from "../socket/socket.js";
import { io } from "../socket/socket.js";
import fs from "fs";
import ffmpeg from "fluent-ffmpeg";
import HLS from "hls-server";
import path from "path";
import multer from "multer";
import uuid from "react-uuid";
let MessageChat = Router();
MessageChat.post("/send/:_id", protectRoute, async (req, res) => {
  try {
    // console.log(req.params);
    const senderId = req.user._id;
    const { _id: receiverId } = req.params;
    const { message } = req.body;
    // console.log(message);
    let converStation = await converStationModel.findOne({
      participants: { $all: [senderId, receiverId] },
    });
    if (!converStation) {
      converStation = await converStationModel.create({
        participants: [senderId, receiverId],
      });
    }

    // console.log("hahah item2", req.params.userId, id);
    const newMessage = new messageShamec({
      senderId,
      receiverId,
      video: message.video,
      image: message.image,
      text: message.text,
    });
    if (newMessage) {
      converStation.messages.push(newMessage._id);
    }
    // socket io funcition will go here
    //   await converStation.save();

    //   await newMessage.save();\
    await Promise.all([converStation.save(), newMessage.save()]);
    const receiverSocketId = getReciverSocketId(receiverId);
    const senderSocketId = getReciverSocketId(senderId);
    if (receiverSocketId) {
      ///io.to(<socket_id></socket_id>).emit() used to send envernt to specific client
      receiverSocketId.forEach((socketId) => {
        const nesMess = {
          messages: {
            _id: newMessage._id,
            video: message.video,
            image: message.image,
            text: message.text,
            createdAt: message.createdAt,
            user: message.user,
          },
          participants: {
            _id: message.user._id,
            Avatar: message.user.avatar,
            Hoten: message.user.name,
          },
        };
        // console.log("scpketIs", nesMess);
        io.to(socketId).emit("newMessage", nesMess);
      });
    }
    // console.log(senderSocketId, "sockey ngyowi giư");
    io.to(senderSocketId).emit("newMessage", {
      messages: {
        _id: newMessage._id,
        video: message.video,
        image: message.image,
        text: message.text,
        createdAt: message.createdAt,
        user: message.user,
      },
      participants: {
        _id: message.user._id,
        Avatar: message.user.avatar,
        Hoten: message.user.name,
      },
    });
    res.status(200).json({ data: newMessage });
    // console.log("hahah item", req.params._id);
  } catch (error) {
    console.log(error.message, "loi say ra");
    res.status(500).json({ message: error });
  }
});

// thuc hien gui video leen tu react native va nha tu form data
ffmpeg.setFfmpegPath("C:\\Users\\levan\\ffmpeg\\bin\\ffmpeg.exe");
const strongeVideo = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/ChatVideos/");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname +
        "-" +
        uuid().substring(0, 8) +
        path.extname(file.originalname)
    );
  },
});
const uploadsVideo = multer({
  storage: strongeVideo,
  limits: {
    fileSize: 500000000, // 10000000 Bytes = 10 MB
  },
  fileFilter(req, file, cb) {
    // upload only mp4 and mkv format
    if (!file.originalname.match(/\.(mp4|MPEG-4|mkv)$/)) {
      return cb(new Error("Please upload a video"));
    }
    cb(undefined, true);
  },
});
MessageChat.post(
  "/ChatVideo/:_id",
  protectRoute,
  uploadsVideo.single("Video"),
  async (req, res) => {
    const filePath = req.file.filename;
    let info = {
      protocol: req.protocol,
      host: req.get("host"),
    };
    // console.log(JSON.stringify(filePath) + "anh duo tra");
    const videoPath =
      `${info.protocol}://${info.host}` + "/ChatVideos/" + filePath;
    const hlsOutputPath = "public/ChatVideos";
    const path2 = uuid().substring(0, 8);
    ffmpeg(videoPath)
      .inputFormat("mp4")
      .outputFormat("hls")
      .outputOptions([
        "-start_number 0", // Số bắt đầu cho tên file segment
        "-hls_time 6", // Độ dài của mỗi phần video (tính bằng giây)
        "-hls_list_size 0", // Số lượng file segment trong playlist. 0 để không giới hạn.
        "-vf scale=-2:1080", // Scale video đến độ phân giải 1080p, giữ tỷ lệ khung hình.
        "-hls_flags single_file", // Tạo một tệp m3u8 và không xoay vòng tên file segment
      ])
      .output(`${hlsOutputPath}/${path2}.m3u8`)
      .on("end", async () => {
        try {
          // console.log(req.params);
          const senderId = req.user._id;
          const { _id: receiverId } = req.params;
          const { video, text, username, userId, avatar, createdAt } = req.body;

          let converStation = await converStationModel.findOne({
            participants: { $all: [senderId, receiverId] },
          });
          if (!converStation) {
            converstation = await converStationModel.create({
              participants: [senderId, receiverId],
            });
          }
          // console.log("hahah item2", req.params.userId, id);
          const newMessage = new messageShamec({
            senderId,
            receiverId,
            video: `${req.protocol}://${req.get(
              "host"
            )}/ChatVideos/${path2}.m3u8`,
          });
          if (newMessage) {
            converstation.messages.push(newMessage._id);
          }
          await Promise.all([converstation.save(), newMessage.save()]);
          const receiverSocketId = getReciverSocketId(receiverId);
          const senderSocketId = getReciverSocketId(senderId);
          if (receiverSocketId) {
            ///io.to(<socket_id></socket_id>).emit() used to send envernt to specific client
            receiverSocketId.forEach((socketId) => {
              const nesMess = {
                messages: {
                  _id: newMessage._id,
                  video: `${req.protocol}://${req.get(
                    "host"
                  )}/ChatVideos/${path2}.m3u8`,
                  createdAt: createdAt,
                  user: {
                    _id: userId,
                    name: username,
                    avatar: avatar,
                  },
                },
                participants: {
                  _id: userId,
                  Avatar: avatar,
                  Hoten: username,
                },
              };
              // console.log("scpketIs", nesMess);
              io.to(socketId).emit("newMessage", nesMess);
            });
          }
          // console.log(senderSocketId, "sockey ngyowi giư");
          io.to(senderSocketId).emit("newMessage", {
            messages: {
              _id: newMessage._id,
              video: `${req.protocol}://${req.get(
                "host"
              )}/ChatVideos/${path2}.m3u8`,
              createdAt: createdAt,
              user: {
                _id: userId,
                name: username,
                avatar: avatar,
              },
            },
            participants: {
              _id: userId,
              Avatar: avatar,
              Hoten: username,
            },
          });

          // console.log("hahah item", req.params._id);
          const originalVideoPath = path.join("public/ChatVideos", filePath);
          fs.unlink(originalVideoPath, (err) => {
            if (err) {
              console.error("Lỗi khi xóa video gốc:", err);
            } else {
              console.log("Đã xóa video gốc thành công");
            }
          });
          return res
            .status(200)
            .json({ msg: "OK", status: 200, message: "susseful" });
        } catch (err) {
          console.log(err);
          return res.status(501).json(err);
        }
      })
      .on("error", (err) => {
        console.error("Lỗi trong quá trình chuyển đổi sang HLS:", err);
        return res.status(500).json({ error: "Chuyển đổi sang HLS thất bại" });
      })
      .run();
  }
);

// upload với ảnh trong nhắn tin với message

const storageImage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname +
        "-" +
        uuid().substring(0, 8) +
        path.extname(file.originalname)
    );
  },
});
const imageFilter = function (req, file, cb) {
  if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
    req.fileValidationError = "Only image files are allowed!";
    return cb(new Error("Only image files are allowed!"), false);
  }
  cb(null, true);
};
const uploads = multer({ storage: storageImage, imageFilter: imageFilter });

MessageChat.post(
  "/ChatImage/:_id",
  protectRoute,
  uploads.array("ArayImages", 15),
  async (req, res) => {
    let info = {
      protocol: req.protocol,
      host: req.get("host"),
    };

    const imagePaths = await req.files.map((file) => {
      let link;
      return `${info.protocol}://${info.host}` + "/uploads/" + file.filename;
    });

    try {
      // console.log(req.params);
      const senderId = req.user._id;
      const { _id: receiverId } = req.params;

      const { video, text, username, userId, avatar, createdAt } = req.body;
      console.log(
        video,
        createdAt,
        text,
        username,
        userId,
        avatar,
        "immgae tr+ddiwpck trar ra "
      );
      let converstation = await converStationModel.findOne({
        participants: { $all: [senderId, receiverId] },
      });
      if (!converstation) {
        converstation = await converStationModel.create({
          participants: [senderId, receiverId],
        });
      }
      // console.log("hahah item2", req.params.userId, id);
      const newMessage = new messageShamec({
        senderId,
        receiverId,
        image: imagePaths,
      });
      if (newMessage) {
        converstation.messages.push(newMessage._id);
      }
      // socket io funcition will go here
      //   await converstation.save();

      //   await newMessage.save();\
      await Promise.all([converstation.save(), newMessage.save()]);
      const receiverSocketId = getReciverSocketId(receiverId);
      const senderSocketId = getReciverSocketId(senderId);
      if (receiverSocketId) {
        ///io.to(<socket_id></socket_id>).emit() used to send envernt to specific client
        receiverSocketId.forEach((socketId) => {
          const nesMess = {
            messages: {
              _id: newMessage._id,
              image: imagePaths,
              createdAt: createdAt,
              user: {
                _id: userId,
                name: username,
                avatar: avatar,
              },
            },
            participants: {
              _id: userId,
              Avatar: avatar,
              Hoten: username,
            },
          };
          // console.log("scpketIs", nesMess);
          io.to(socketId).emit("newMessage", nesMess);
        });
      }
      console.log(senderSocketId, "sockey ngyowi giư");
      io.to(senderSocketId).emit("newMessage", {
        messages: {
          _id: newMessage._id,
          image: imagePaths,
          createdAt: createdAt,
          user: {
            _id: userId,
            name: username,
            avatar: avatar,
          },
        },
        participants: {
          _id: userId,
          Avatar: avatar,
          Hoten: username,
        },
      });
      res.status(200).json({ data: newMessage });
      // console.log("hahah item", req.params._id);
    } catch (error) {
      console.log(error.message, "loi say ra");
      res.status(500).json({ message: error });
    }
  }
);

MessageChat.get("/getMessage/:id", protectRoute, async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    console.log(userToChatId);
    const senderId = req.user._id;

    const converstation = await converStationModel
      .findOne({
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
      return res.status(200).json({ data: [] });
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
