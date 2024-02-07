import express from "express";
import mongoose from 'mongoose';
import { Router, query } from "express";
import db from "../config/MongoDb.js";
import user from "../model/user.js";
import baiviet from "../model/baiviet.js";
import Likecmt from "../model/Likecmt.js";
import Comment from "../model/Comment.js";
import CommentVideo from "../model/CommentVideo.js";
import CommentVideoChildrent from "../model/CommentVideoChildrent.js";
const like = Router();
like.post('/tymPost', async (req, res) => { 
    try {
        const idUser = req.body.idUser; // Lấy id của người dùng
        const idBaiPost =  req.body.idBaiPost; // Lấy id của bài viết
        const numberLike = req.body.Soluong; // Lấy số lượng tym
        const isLiked =req.body.Trangthai; // Lấy trạng thái like
        const baiViet = await baiviet.findById(idBaiPost);
        if (!baiViet) {
          return res.status(404).json({ message: 'Không tìm thấy bài viết.' });
        }
        const existingLike = baiViet.Like.find(like => like.User.equals(idUser));
             console.log('like')
      if (existingLike) {
            existingLike.Trangthai = isLiked;
            baiViet.SoluongTym = numberLike;

        } else {
          baiViet.Like.push({ User: idUser, Trangthai: isLiked });
          baiViet.SoluongTym =numberLike;
      }
      const kiemtra = await baiViet.save();
      
        return res.status(200).json({ data: kiemtra, message: 'Thích bài viết thành công.' });
      } catch (error) {
      
        return res.status(500).json({ message: 'Lỗi server.' });
      }
})
    like.post('/selectLike',async (req, res) => {
        try {
            const {Like}= await baiviet.findById({ _id: req.body._idBaiviet}).select('Like')
            return res.status(200).json({ data: Like, msg: "OK", status: 200 });
         } catch (ero) {
            res.status(500).json(ero);
        }
    })
like.post('ComentLike', async (req, res) => {
  try {
    let Idcomment = await Comment.findById( req.body.idComment)
    idComment.SoluongThich = req.body.Soluongthich;

    let insertLikeCmt = await new Likecmt({
      User: req.body.Userlike,
      Trangthai: req.body.isLike,
      IdCommnent: req.body.idComment
    }).save();
    idComment.idLike.push(insertLikeCmt._id);
    await Idcomment.save();

    return res.status(200).json({ data: myComments, status: 200, message: "oki." });
  } catch (err) {
    res.status.json(err);
  }
})
like.post('/likeComemntVideoParent', async (req, res) => {
  try {
 
    let Idcomment = await CommentVideo.findById(req.body.idcomment)

    Idcomment.soluonglike  = req.body.Soluong;
    Idcomment.idLike.push(req.body.idlike)
    Idcomment.trangthai = req.body.Trangthai
    if (req.body.Trangthai==false) {
      Idcomment.idLike.pull(req.body.idlike);
    }
    await Idcomment.save();
    return res.status(200).json({ status: 200, message: "oki." });
  } catch (err) {
     return res.status(500).json({ message: 'Lỗi server.'+err});
  }
})
like.post('bo', async (req, res) => {
  try {
 
    let Idcomment = await CommentVideoChildrent.findById(req.body.idcomment)

    Idcomment.soluonglike  = req.body.Soluong;
    Idcomment.idLike.push(req.body.idlike)
    Idcomment.trangthai = req.body.Trangthai
    if (req.body.Trangthai==false) {
      Idcomment.idLike.pull(req.body.idlike);
    }
    await Idcomment.save();
    return res.status(200).json({ status: 200, message: "oki." });
  } catch (err) {
     return res.status(500).json({ message: 'Lỗi server.'+err});
  }
})
export default like;
