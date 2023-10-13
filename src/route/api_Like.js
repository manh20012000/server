import express from "express";
import mongoose from 'mongoose';
import { Router, query } from "express";
import db from "../config/MongoDb.js";
import user from "../model/user.js";
import baiviet from "../model/baiviet.js";
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
        console.error(error);
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
export default like;
