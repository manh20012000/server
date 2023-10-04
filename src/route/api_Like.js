import express from "express";
import mongoose from 'mongoose';
import { Router, query } from "express";
import db from "../config/MongoDb.js";
import user from "../model/user.js";
import baiviet from "../model/baiviet.js";
const like = Router();
like.post('/tymPost', async (req, res) => { 
    try {
        const kiemtra = await baiviet.findOneAndUpdate(
            { _id: req.body.idBaiPost, 'Like.User': req.body.idUser },
            { $inc: {SoluongTym: req.body.Soluong}, $push: { Like: { User: req.body.idUser, Trangthai: req.body.Trangthai } } }, 
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
})
    like.post('/selectLike',async (req, res) => {
        try {
            console.log(req.body._idBaiviet)
            const {Like}= await baiviet.findById({ _id: req.body._idBaiviet}).select('Like')
            console.log(Like);
            return res.status(200).json({ data: Like, msg: "OK", status: 200 });
         } catch (ero) {
            res.status(500).json(ero);
        }
    })

export default like;
