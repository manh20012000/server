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
            { $inc: {SoluongCmt:req.body.SoluongCmt,Content.Trangthai:req.body.Content}}, 
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
export default binhluan;
