import express from "express";
import mongoose from "mongoose";
import CommentVideo from "../model/CommentVideo.js";
import LikecmtVideo from "../model/LikecmtVideo.js";
import { Router, query } from "express";
import path from "path";
import multer from "multer";
import uuid from "react-uuid";
import appRoot from "app-root-path";
import Video from "../model/Video.js";
import CommentVideoChildrent from "../model/CommentVideoChildrent.js";
import handlerFunction from "./api_functionNotification.js";
import user from "../model/user.js";
import protectRoute from "../middlewere/protectRoute.js";
const api_CommentVideo = Router();
import Notification from "../model/Notification.js";
api_CommentVideo.post(
  "/api_CommentVideoGet",
  protectRoute,
  async (req, res) => {
    try {
      console.log("hahjdjcbdhbdwchn");
      console.log(req.body.idVideo, req.body.Skips);
      const qualitySkip = req.body.Skips;
      const comments = await CommentVideo.find({
        idVideo: req.body.idVideo,
      })
        .populate({
          path: "comments",
          populate: { path: "User" }, // Populate toàn bộ object của comment con
        })
        .populate({ path: "User" })
        .limit(15)
        .skip(qualitySkip);

      return res
        .status(200)
        .json({ data: comments, status: 200, message: "oki." });
    } catch (err) {
      return res.status(500).json(err);
    }
  }
);
api_CommentVideo.get(
  "/api_CommentVideoGetChildrent/:parentId/:qualitySkip",
  async (req, res) => {
    try {
      let myComments = await CommentVideoChildrent.find({
        idParentComment: req.params.parentId,
      })
        .limit(3)
        .skip(req.params.qualitySkip)
        .populate({ path: "User" });

      return res
        .status(200)
        .json({ data: myComments, status: 200, message: "oki." });
    } catch (err) {
      return res.status(500).json(err);
    }
  }
);
// uploaf comment video
api_CommentVideo.post(
  "/api_CommentVideoPost",
  protectRoute,
  
  async (req, res) => {
    try {
      console.log("haiaja");
      const idUser = req.body.UserCmt;
      const idVideo = req.body.idVideo;
      const soluongcmt = req.body.Soluongcmt;
      const Noidung = req.body.Conten;
      const IdComment = req.body.idParentComment;
      const _id = req.body._id;
      const nameComemnt = req.body.nameComemnt;
      const title = req.body.title;
      const avatarSend = req.body.avatarSend;
      const messagenotifi = req.body.messagenotifi;
      console.log(messagenotifi, 'gsudhaifjlkaiyjga')
      let video = await Video.findOne({ _id: idVideo });
      if (video) {
        console.log(soluongcmt, "sjdhjsjdjfnj");
        video.SoluongCmt = soluongcmt;
        await video.save();
        // console.log("nhày vào đay đàu tiên ", IdComment, typeof IdComment);
        const userVideo = await user.findById(video.User);
        if (!userVideo)
          return res.status(403).json({ message: "bị lỗi với lấy usr" });
        if (userVideo) {
          let DadyComment = await CommentVideo.findById(IdComment);
          await handlerFunction(
            userVideo.fcmToken,
            title,
            `${nameComemnt || "Người dùng"} comment video `,
            {
              type: "comment ",
              screen: "Videodetail",
              id: idVideo,
              from: nameComemnt,
              someData: "goes here",
            }
          );
          console.log("L  i gửi thông báo: ");
          if (IdComment) {
            let DadyComment = await CommentVideo.findById(IdComment);
            console.log(req.body._id, "gía trị id mới là ");
            let childComment = await new CommentVideo({
              _id: _id,
              User: idUser,
              Content: Noidung,
              idLike: [],
              soluonglike: 0,
              idVideo: idVideo,
              idParentComment: IdComment,
            });
            DadyComment.comments.push(req.body._id);
            await Promise.all([DadyComment.save(), childComment.save()]);
            return res.status(200).json({ status: 200, message: "oki." });
          } else {
            let CommentDady = await new CommentVideo({
              _id: _id,
              User: idUser,
              Content: Noidung,
              comments: [],
              idVideo: idVideo,
              idLike: [],
            });

            // console.log(DadyComment.SoluongCommentChildrent + "hahaha");

            await Promise.all([video.save(), CommentDady.save()]);
          }
          console.log(req.user, typeof req.user);

          await handlerFunction(
            userVideo.fcmToken,
            title,
            `${nameComemnt || "Người dùng"} comment video `,
            {
              type: "comment ",
              from: nameComemnt,
              someData: "goes here",
            }
          );
          console.log("L  i gửi thông báo: ");
          console.log(messagenotifi, 'gsudhaifjlkaiyjga2345678')
          await new Notification({
            reciveId: userVideo._id,
            sendId: idUser,
            isRead: false,
            title: title,
            idOjectModel: idVideo,
            messageNotifi: messagenotifi,
            thumbnailObject: video.thumbnail ?? null, // Nếu baiViet.thumbnail là null hoặc undefined, trả về null
            avatarSend: avatarSend,
          }).save();

          return res.status(200).json({ status: 200, message: "oki." });
        }
      } else {
        return res.status(500).json({ status: 500, message: "sever lỗi." });
      }
    } catch (err) {
      console.log(err, "exception");
      return res.status(500).json(err);
    }
  }
);
api_CommentVideo.delete(
  "/deleteCommentVideo/:commentId/:idVideo/:QualityComment",
  async (req, res) => {
    try {
      const commentId = req.params.commentId;
      const idVideo = req.params.idVideo;
      const QualityComment = req.params.QualityComment;
      const existingComment = await CommentVideo.findById(commentId);

      if (!existingComment) {
        return res.status(404).json({ message: "Comment not found" });
      }
      const commentChildren = await CommentVideoChildrent.deleteMany({
        idParentComment: commentId,
      });
      const video = await Video.findById(idVideo);
      video.SoluongCmt -= QualityComment;
      // console.log("so lcmt" + video.SoluongCmt);
      await video.save();
      await CommentVideo.findByIdAndDelete(commentId);
      const remainingComments = await CommentVideo.find({
        idVideo: idVideo,
      }).populate({ path: "User" });
      return res.status(200).json({
        message: "Comment deleted successfully",
        comments: remainingComments,
        soluongcmt: video.SoluongCmt,
      });
    } catch (err) {
      return res.status(500).json({ message: err });
    }
  }
);
api_CommentVideo.delete(
  "/deleteCommentChildrenVideo/:commentId/:idVideo/:idCommentParent",
  async (req, res) => {
    try {
      const commentId = req.params.idCommentParent;
      const idVideo = req.params.idVideo;
      const commentIdChildrent = req.params.commentId;

      const existingComment = await CommentVideo.findById(commentId);
      if (!existingComment) {
        return res.status(404).json({ message: "Comment not found" });
      }
      existingComment.SoluongCommentChildrent -= 1;
      await existingComment.save();
      const video = await Video.findById(idVideo);
      video.SoluongCmt -= 1;
      // console.log("so lcmt" + video.SoluongCmt);
      await video.save();
      await CommentVideoChildrent.findByIdAndDelete(commentIdChildrent);
      // console.log(commentId, idVideo, commentIdChildrent);
      const remainingComments = await CommentVideo.find({
        idVideo: idVideo,
      }).populate({ path: "User" });
      return res.status(200).json({
        message: "Comment deleted successfully",
        comments: remainingComments,
        soluongcmt: video.SoluongCmt,
      });
    } catch (err) {
      return res.status(500).json({ message: err });
    }
  }
);

export default api_CommentVideo;
