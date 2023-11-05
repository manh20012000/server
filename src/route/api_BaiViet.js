import express from "express";
import mongoose from "mongoose";
import { Router, query } from "express";
import db from "../config/MongoDb.js";
import baiviet from "../model/baiviet.js";
const Baiviet = Router();
Baiviet.get("/selectBaiViet", async (req, res) => {
  try {
    const allPosts = await baiviet
      .find({}) .populate({ path: "User" });
      // .populate({ path: "Comment", populate: { path: "User" } });
    const swappedPosts = allPosts.reverse();
    if (allPosts) {
      return res.status(200).json({ data: swappedPosts });
    } else if (!allPosts) {
      return res.status(404).json({ message: "Bài viết không tồn tại" });
    }
  } catch (err) {
    return res.status(500).json(err);
  }
});
Baiviet.get("/selectPost_inUser", async (req, res) => {
  try {
    const userId = req.body.userId;
    const userPosts = await baiviet.find({ User: userId }).populate("User");
      // .populate({ path: "Comment", populate: { path: "User" } });
    if (userPosts) {
      return res.status(200).json({ data: userPosts });
    } else if (!userPosts) {
      return res.status(404).json({ message: "Bài viết không tồn tại" });
    }
  } catch (err) {
    return res.status(500).json(err);
  }
})

export default Baiviet;
