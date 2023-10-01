import express from "express";
import mongoose from "mongoose";
import { Router, query } from "express";
import db from "../config/MongoDb.js";
import baiviet from "../model/baiviet.js";
const Baiviet = Router();
Baiviet.get('/selectBaiViet', async (req, res) => {
    try {
        const allPosts = await baiviet.find({});
        console.log(allPosts[0])
        if (allPosts[0]) {
             return res.status(200).json({data:"djd"})
        }else if (!allPosts) {
            return res.status(404).json({ message: 'Bài viết không tồn tại' });
          }
    } catch (err) {
        return res.status(500).json(err);
        }
})
 
export default Baiviet;