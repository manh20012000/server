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

const api_CommentVideo = Router();

api_CommentVideo.post("/api_CommentVideoGet", async (req, res) => {
  try {
    const qualitySkip = req.body.Skips;
    const comments = await CommentVideo.find({
      idVideo: req.body.idVideo,
    })
      .limit(8)
      .skip(qualitySkip)
      .populate({ path: "User" });

    return res
      .status(200)
      .json({ data: comments, status: 200, message: "oki." });
  } catch (err) {
    return res.status(500).json(err);
  }
});
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
api_CommentVideo.post("/api_CommentVideoPost", async (req, res) => {
  try {
    console.log("haiaja");
    const idUser = req.body.UserCmt;
    const idVideo = req.body.idVideo;
    const soluongcmt = req.body.Soluongcmt;
    const Noidung = req.body.Conten;
    const IdComment = req.body.idParentComment;
    const _id = req.body._id;
    let video = await Video.findOne({ _id: idVideo });
    if (video) {
      video.SoluongCmt = soluongcmt;
      await video.save();
      // console.log("nhày vào đay đàu tiên ", IdComment, typeof IdComment);
      if (IdComment) {
    
        let DadyComment = await CommentVideo.findById(IdComment);
        let childComment = await new CommentVideoChildrent({
          _id: _id,
          User: idUser,
          Content: Noidung,
          idVideo: idVideo,
          idParentComment: IdComment,
          idLike: [],
          soluonglike: 0,
        }).save();
        DadyComment.SoluongCommentChildrent += 1;
        // console.log(DadyComment.SoluongCommentChildrent + "hahaha");
        await DadyComment.save();
     
        let myComments = await CommentVideo.find({ idVideo: idVideo }).populate(
          { path: "User" }
        );
        return res
          .status(200)
          .json({ data: myComments, status: 200, message: "oki." });
      } else {
        console.log("nhày vào đay 1 ");
        let CommentDady = await new CommentVideo({
          _id: _id,
          User: idUser,
          Content: Noidung,
          idVideo: idVideo,
          idLike: [],
          soluonglike:0,
        }).save();
        let myComments = await CommentVideo.find({ idVideo: idVideo }).populate(
          { path: "User" }
        );
        return res
          .status(200)
          .json({ data: myComments, status: 200, message: "oki." });
      }
    } else {
      return res.status(500).json({ status: 500, message: "sever lỗi." });
    }
  } catch (err) {
    console.log(err, "exception");
    return res.status(500).json(err);
  }
});
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
