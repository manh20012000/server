import express from "express";
import mongoose from "mongoose";
import { Router, query } from "express";
import db from "../config/MongoDb.js";
import user from "../model/user.js";
import Video from "../model/Video.js";
import protectRoute from "../middlewere/protectRoute.js";
import Notification from "../model/Notification.js";
import handlerFunction from "./api_functionNotification.js";
const LikeVideo = Router();
LikeVideo.post("/LikeVideo", protectRoute, async (req, res) => {
  try {
    console.log("idUser:", req.body.idUser); // Lấy id của người dùng
    console.log("idVideo:", req.body.IdVideo); // Lấy id của video
    console.log("nameComemnt:", req.body.nameComemnt);
    console.log("title:", req.body.title);
    console.log("Soluong:", req.body.Soluong);
    console.log("avatarSend:", req.body.avatarSend);
    console.log("messagenotifi:", req.body.messagenotifi);
    // Tìm video theo Id
    const {
      idUser,
      IdVideo,
      nameComemnt,
      title,
      Soluong,
      avatarSend,
      messagenotifi,
    } = req.body;
    const pVideo = await Video.findById(IdVideo);
    console.log(pVideo, "lấy ra video là null ");
    if (!pVideo) {
      return res.status(404).json({ message: "Không tìm thấy video." });
    }
    // Kiểm tra xem user đã like video chưa
    const existingLike = pVideo.Like.find((like) => like.equals(idUser));
    const userVideo = await user.findById(pVideo.User);
    if (existingLike) {
      // Nếu đã like, bỏ user khỏi mảng Like
      pVideo.Like = pVideo.Like.filter((idlike) => !idlike.equals(idUser));
    } else {
      pVideo.Like.push(idUser);

      console.log("L��i gửi thông báo: ");
      const notification = await new Notification({
        reciveId: userVideo._id,
        sendId: idUser,
        isRead: false,
        title: title,
        idOjectModel: IdVideo,
        messageNotifi: messagenotifi,
        thumbnailObject: pVideo.thumbnail ?? null, // Nếu baiViet.thumbnail là null hoặc undefined, trả về null
        avatarSend: avatarSend,
      }).save();
      await handlerFunction(
        userVideo.fcmToken,
        title,
        `${nameComemnt || "Người dùng"} comment video `,
        {

          idOjectModel: IdVideo,
          _id: notification._id,
          isRead: false,
          screen: "Videodetail",
          type: "comment ",
          from: nameComemnt,
          someData: "goes here",
        }
      );
    }

    // Cập nhật số lượng like dựa trên độ dài mảng Like
    pVideo.SoluongTym = Soluong;

    // Lưu lại các thay đổi

    await Promise.all([pVideo.save()]);
    return res.status(200).json({
      data: pVideo,
      message: existingLike
        ? "Bỏ thích thành công."
        : "Thích bài viết thành công.",
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "Lỗi server." });
  }
});
LikeVideo.post("/selectLikeVideo", protectRoute, async (req, res) => {
  try {
    // Tìm video theo IdVideo và chỉ chọn trường "Like"
    const video = await Video.findById(req.body.IdVideo);
    console.log(video);
    // Kiểm tra nếu không tìm thấy video
    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    // Nếu trường Like không tồn tại hoặc là null, khởi tạo nó thành mảng rỗng

    // Trả về mảng "Like"
    return res.status(200).json({ data: video.Like, msg: "OK", status: 200 });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Error: " + err });
  }
});
export default LikeVideo;
