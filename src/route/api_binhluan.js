import express from "express";
import mongoose from 'mongoose';
import { Router, query } from "express";
import db from "../config/MongoDb.js";
import user from "../model/user.js";
import baiviet from "../model/baiviet.js";
const binhluan = Router();
binhluan.post('/binhluanPost', async (req, res) => { 
    try {
        const kiemtra = await baiviet.findOneAndUpdate(
            { _id: req.body.idBaiPost, 'binhluan.User': req.body.idUser },
            { $inc: { SoluongCmt: req.body.SoluongCmt }, $push: { binhluan: { User: req.body.idUser, Content: req.body.Content, } } }, 
            { new: true }//  bai viet được cập nhâtj
        )
        if (!kiemtra) {
            console.log('nguoi dung chưa tồn tain và')
            const newbinhluan = {
                User: req.body.idUser,
                Content: req.body.Content,
            }; 
            kiemtra.binhluan.push(newbinhluan);
            kiemtra.SoluongCmt += 1;
        }
        await kiemtra.save();
        return res.status(200).json({data:kiemtra, message: 'binhluan.'});
    } catch (err) {
        return res.status(500).json(err);
    }
}
)
binhluan.post('/SendBinhluan', async (req, res) => {
    try {
        const idUser = req.body.UserCmt; // Lấy id của người dùng
        const idBaiPost =  req.body.idBaiviet; // Lấy id của bài viết
        const soluongcmt = req.body.Soluongcmt; // Lấy số lượng tym
        const Noidung =req.body.Noidung; // Lấy trạng thái like
        console.log(idUser, idBaiPost, soluongcmt, Noidung);
        const baiViet = await baiviet.findById(idBaiPost);
        if (!baiViet) {
          return res.status(404).json({ message: 'ljonh tim thay binhluan' });
        }
      
          baiViet.Comment.push({ User: idUser,  Content: Noidung });
          baiViet.SoluongCmt =soluongcmt;

        const kiemtra = await baiViet.save();
        return res.status(200).json({ data: kiemtra.Comment,status:200, message: 'oki.' });
      } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Lỗi server.' });
      }
})
export default binhluan;
