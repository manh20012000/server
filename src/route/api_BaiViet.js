import express from "express";
import mongoose from "mongoose";
import { Router, query } from "express";
import db from "../config/MongoDb.js";
import baiviet from "../model/baiviet.js";
import user from "../model/user.js";
import protectRoute from "../middlewere/protectRoute.js";
import Notification from "../model/Notification.js";
const Baiviet = Router();
Baiviet.get("/selectBaiViet", async (req, res) => {
  try {
    const allPosts = await baiviet
      .find({})
      .sort({ createdAt: -1 })
      .populate({ path: "User" });
    // .populate({ path: "Comment", populate: { path: "User" } });
    if (allPosts) {
      // console.log(swappedPosts);
      return res.status(200).json({ data: allPosts });
    } else if (!allPosts) {
      return res.status(404).json({ message: "Bài viết không tồn tại" });
    }
  } catch (err) {
    return res.status(500).json(err);
  }
});
Baiviet.post("/selectPost_inUser", protectRoute, async (req, res) => {
  try {
    const userId = req.body.userId;
    const senderId = req.user._id;
    console.log(userId, "jaosjd", senderId);
    const userPosts = await baiviet.find({ User: userId }).populate("User");
    // console.log(!!userPosts, "jaosjd", senderId);
    if (userPosts) {
      // console.log(userPosts)
      const result = await user.find({
        _id: senderId,
        AcceptFriend: { $in: [userId] },
      });
      let trangthais = false;
      if (result) {
        trangthais = true;
      }
      // console.log(trangthais, userPosts, "hahah");
      return res.status(200).json({ data: userPosts, trangthai: trangthais });
    } else if (!userPosts) {
      return res
        .status(404)
        .json({ message: "Bài viết không tồn tại", trangthai: false });
    }
  } catch (err) {
    return res.status(500).json(err);
  }
});
Baiviet.get("/get_Article_Getone/:id", protectRoute, async (req, res) => {
  const fileId = req.query.id; //id của cái thông báo
  const isreadNotifi = req.query.iread === "true"; //chuyển đổi ở dạng stribg boolean sang dạng boolean
  try {
    console.log("ngyar vào đây để dược câoasj nhât+>>> ", typeof isreadNotifi);
    if (isreadNotifi === false) {
      console.log("ngyar vào đây để dược câoasj nhât+>>>3333 ", isreadNotifi);
      const notification = await Notification.findByIdAndUpdate(
        fileId,
        { isRead: true },
        { new: true }
      );
    }

    const article = await baiviet.findById(req.params.id).populate("User");
    if (!article) {
      return res.status(404).json({ message: "Bài viết không tồn tại" });
    }

    return res
      .status(200)
      .json({ data: article, status: 200, message: "thành công" });
  } catch (err) {
    return res.status(500).json(err);
  }
});
export default Baiviet;
