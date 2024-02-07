import express from "express";
import mongoose from 'mongoose';
import { Router, query } from "express";
import db from "../config/MongoDb.js";
import user from "../model/user.js";
import Video from "../model/Video.js";
const LikeVideo = Router();
LikeVideo.post('/LikeVideo', async (req, res) => { 
  try {
        const idUser = req.body.idUser; // Lấy id của người dùng
        const idVideo =  req.body.IdVideo; // Lấy id của bài viết
    const numberLike = req.body.Soluong; // Lấy số lượng tym
    console.log(numberLike)
        const isLiked =req.body.Trangthai; // Lấy trạng thái like
        const pVideo = await Video.findById(idVideo);
        if (!pVideo) {
          return res.status(404).json({ message: 'Không tìm thấy bài viết.' });
        }
        const existingLike = pVideo.Like.find(like => like.User.equals(idUser));
    if (existingLike) {
            existingLike.Trangthai = isLiked;
            pVideo.SoluongTym = numberLike;

    } else {
     
      pVideo.Like.push({ User: idUser, Trangthai: isLiked });
      pVideo.SoluongTym = numberLike; 
      }
    const kiemtra = await pVideo.save();
    // console.log('hahahha',kiemtra)
        return res.status(200).json({ data: kiemtra, message: 'Thích bài viết thành công.' });
      } catch (error) {
      
        return res.status(500).json({ message: 'Lỗi server.' });
      }
})
LikeVideo.post('/selectLikeVideo',async (req, res) => {
        try {
            const {Like}= await Video.findById({ _id:req.body.IdVideo}).select('Like')
            return res.status(200).json({ data: Like, msg: "OK", status: 200 });
         } catch (ero) {
            res.status(500).json(ero);
        }
    })

export default LikeVideo;
