import express from "express";
import mongoose from 'mongoose';
import { Router, query } from "express";
import db from "../config/MongoDb.js";
import user from "../model/user.js";
import baiviet from "../model/baiviet.js";
const Like = Router();
Like.post('/tymPost', async (req, res) => { 
    try {
        const kiemtra = await baiviet.findOneAndUpdate(
            { _id: req.body.idBaiPost, 'Like.User': req.body.idUser },
            { $inc: {SoluongTym:req.body.Soluong,Like.Trangthai:req.body.Trangthai}}, 
            { new: true }//  bai viet được cập nhâtj
        )
        if (!kiemtra) {
            console.log('nguoi dung chưa tồn tain và')
            const newLike = {
                User: req.body.idUser,
                Trangthai: req.body.Trangthai,
            }; 
            kiemtra.Like.push(newLike);
            kiemtra.SoluongTym += 1;
        }else {
            // Nếu bài viết đã tồn tại trong mảng Like.User của người dùng
            // Cập nhật trạng thái của người dùng và các giá trị cập nhật khác
            const likeIndex = kiemtra.Like.findIndex(like => like.User.toString() === req.body.idUser);
            kiemtra.Like[likeIndex].Trangthai = req.body.Trangthai;
        }
        await kiemtra.save();
        return res.status(200).json({data:kiemtra, message: 'Thích bài viết thành công.' });
    } catch (err) {
        return res.status(500).json(err);
    }
}
)
export default Like;
