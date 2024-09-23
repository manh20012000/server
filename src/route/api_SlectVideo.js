import express from "express";
import mongoose from "mongoose";
import { Router, query } from "express";
import db from "../config/MongoDb.js";
import Video from "../model/Video.js";
import Story from "../model/Story.js";
import protectRoute from "../middlewere/protectRoute.js";
const VideoSelect = Router();
VideoSelect.post("/selectVideo", protectRoute, async (req, res) => {
  try {
    // console.log(req.body.limiteds,req.body.skip)
    // Sử dụng limit trong truy vấn để giới hạn số lượng video trả về
    const videos = await Video.find()
      .limit(req.body.limiteds)
      .skip(req.body.skip)
      .sort({ createdAt: -1 })
      .populate({ path: "User" });
    return res.status(200).json({ data: videos, status: 200, message: "OK." });
  } catch (err) {
    return res
      .status(500)
      .json({ status: 500, message: "Internal server error.", error: err });
  }
});
VideoSelect.post("/selectedVideoId", protectRoute, async (req, res) => {
  try {
    // console.log('hahaha')
    const videos = await Video.find({ User: req.body.id })
      .limit(req.body.limiteds)
      .skip(req.body.skip)
      .sort({ createdAt: -1 })
      .populate({ path: "User" });
    return res.status(200).json({ data: videos, status: 200, message: "OK." });
  } catch (err) {
    return res
      .status(500)
      .json({ status: 500, message: "Internal server error.", error: err });
  }
});
VideoSelect.post("/selectStory", async (req, res) => {
  try {
    // Sử dụng limit trong truy vấn để giới hạn số lượng video trả về
    const Storys = await Story.find()
      .limit(req.body.limiteds)
      .skip(req.body.skip)
      .sort({ createdAt: -1 })
      .populate({ path: "User" });
    const Storydata = Storys.reverse();
    return res
      .status(200)
      .json({ data: Storydata, status: 200, message: "OK." });
  } catch (err) {
    return res
      .status(500)
      .json({ status: 500, message: "Internal server error.", error: err });
  }
});
export default VideoSelect;
