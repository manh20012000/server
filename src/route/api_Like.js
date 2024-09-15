import express from "express";
import mongoose from "mongoose";
import { Router, query } from "express";
import db from "../config/MongoDb.js";
import user from "../model/user.js";
import baiviet from "../model/baiviet.js";
import Likecmt from "../model/Likecmt.js";
import Comment from "../model/Comment.js";
import CommentVideo from "../model/CommentVideo.js";
import CommentVideoChildrent from "../model/CommentVideoChildrent.js";
import protectRoute from "../middlewere/protectRoute.js";
import handlerFunction from "./api_functionNotification.js";
import Notification from "../model/Notification.js";
const like = Router();
like.post("/tymPost", protectRoute, async (req, res) => {
  try {
    console.log("nhay vào tym ");
    const idUser = req.body.idUser; // Lấy id của người dùng like bài viết này
    const idBaiPost = req.body.idBaiPost; // Lấy id của bài viết
    const numberLike = req.body.Soluong; // Lấy số lượng tym
    const isLiked = req.body.Trangthai; // Trạng thái like hay chưa like (true / false)
    const nameLike = req.body.nameLike;
    const screen = req.body.screen;
    const baiViet = await baiviet.findById(idBaiPost);
    if (!baiViet) {
      return res.status(404).json({ message: "Không tìm thấy bài viết." });
    }
    // Tìm xem user đã like chưa
    const existingLikeIndex = baiViet.Like.findIndex(
      (like) => like.User && like.User === idUser
    );

    if (existingLikeIndex !== -1) {
      // Nếu trạng thái like là false, tức là người dùng bỏ like, thì xóa khỏi danh sách
      if (!isLiked) {
        baiViet.Like.splice(existingLikeIndex, 1); // Xóa like của user khỏi mảng
        baiViet.SoluongTym = numberLike; // Cập nhật số lượng tym
      } else {
        // Nếu người dùng vẫn like, cập nhật trạng thái
        baiViet.Like[existingLikeIndex].Trangthai = isLiked;
        baiViet.SoluongTym = numberLike;
      }
    } else {
      const userAtical = await user.findById(baiViet.User);
      if (!userAtical) return res.status(403);
      // Nếu user chưa like và bây giờ like (isLiked === true), thêm vào danh sá
      if (isLiked) {
        console.log("bắt đầu gữi thông báo  ", nameLike);
        try {
          await handlerFunction(
            userAtical.fcmToken,
            "thích bài viết ",
            `${userAtical.Hoten || "Người dùng"} thích bài viết của bạn!`,
            {
              type: "thả tim video ",
              from: nameLike,
              someData: "goes here",
            }
          );
        } catch (e) {
          console.error("L��i gửi thông báo: ", e);
        }
        console.log("gữi thông báo thành công với đoạn mã này ");

        // baiViet.Like.push({ User: idUser, Trangthai: isLiked });
        // baiViet.SoluongTym = numberLike;
        const notification = await new Notification({
          reciveId: userAtical._id,
          sendId: idUser,
          Object_Notifi: {
            idConten: baiViet._id,
            typeScreen: screen,
          },
          refParam: "baiViet",
          isRead: false,
          title: "Thông báo mới",
          body: `${nameLike} thích bài viết của bạn!`,
        }).save();
      }
    }
    // Lưu thay đổi vào cơ sở dữ liệu
    const kiemtra = await baiViet.save();

    return res
      .status(200)
      .json({ data: kiemtra, message: "Cập nhật thích bài viết thành công." });
  } catch (error) {
    return res.status(500).json({ message: "Lỗi server: " + error });
  }
});

like.post("/selectLike", protectRoute, async (req, res) => {
  try {
    const { Like } = await baiviet
      .findById({ _id: req.body._idBaiviet })
      .select("Like");
    return res.status(200).json({ data: Like, msg: "OK", status: 200 });
  } catch (ero) {
    res.status(500).json(ero);
  }
});
like.post("ComentLike", async (req, res) => {
  try {
    let Idcomment = await Comment.findById(req.body.idComment);
    idComment.SoluongThich = req.body.Soluongthich;

    let insertLikeCmt = await new Likecmt({
      User: req.body.Userlike,
      Trangthai: req.body.isLike,
      IdCommnent: req.body.idComment,
    }).save();
    idComment.idLike.push(insertLikeCmt._id);
    await Idcomment.save();

    return res
      .status(200)
      .json({ data: myComments, status: 200, message: "oki." });
  } catch (err) {
    res.status.json(err);
  }
});
like.post("/likeComemntVideoParent", async (req, res) => {
  try {
    let Idcomment = await CommentVideo.findById(req.body.idcomment);

    Idcomment.soluonglike = req.body.Soluong;
    Idcomment.idLike.push(req.body.idlike);
    Idcomment.trangthai = req.body.Trangthai;
    if (req.body.Trangthai == false) {
      Idcomment.idLike.pull(req.body.idlike);
    }
    await Idcomment.save();
    return res.status(200).json({ status: 200, message: "oki." });
  } catch (err) {
    return res.status(500).json({ message: "Lỗi server." + err });
  }
});
like.post("/likeComemntVideoChildren", async (req, res) => {
  try {
    let Idcomment = await CommentVideoChildrent.findById(req.body.idcomment);

    Idcomment.soluonglike = req.body.Soluong;
    Idcomment.idLike.push(req.body.idlike);
    Idcomment.trangthai = req.body.Trangthai;
    if (req.body.Trangthai == false) {
      Idcomment.idLike.pull(req.body.idlike);
    }
    await Idcomment.save();
    return res.status(200).json({ status: 200, message: "oki." });
  } catch (err) {
    return res.status(500).json({ message: "Lỗi server." + err });
  }
});
export default like;
