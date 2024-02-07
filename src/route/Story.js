import express from "express";
import mongoose from "mongoose";
import { Router, query } from "express";
import db from "../config/MongoDb.js";
import Story from "../model/Story.js";
import path from "path";
import multer from "multer";
import uuid from "react-uuid";
import appRoot from "app-root-path";
import axios from "axios";
import fs from "fs";
import ffmpeg from "fluent-ffmpeg";
import HLS from "hls-server";
const StoryVideo = Router();
ffmpeg.setFfmpegPath(
  "C:\\Users\\levan\\ffmpeg-2024-01-24-git-00b288da73-essentials_build\\ffmpeg-2024-01-24-git-00b288da73-essentials_build\\bin\\ffmpeg.exe"
);
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/Story/");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname +
        "-" +
        uuid().substring(0, 8) +
        path.extname(file.originalname)
    );
  },
});
const uploadsVideo = multer({
  storage: storage,
  limits: {
    fileSize: 500000000, // 10000000 Bytes = 10 MB
  },
  fileFilter(req, file, cb) {
    // upload only mp4 and mkv format
    if (!file.originalname.match(/\.(mp4|MPEG-4|mkv)$/)) {
      return cb(new Error("Please upload a video"));
    }
    cb(undefined, true);
  },
});
StoryVideo.post(
  "/uploadStory",
  uploadsVideo.single("Story"),
  async (req, res) => {
    const filePath = req.file.filename;
    let info = {
      protocol: req.protocol,

      host: req.get("host"),
    };

    const videoPath =
      `${info.protocol}://${info.host}` + "/Story/" + filePath;
    console.log(videoPath, req.body.resizeMode);
    const hlsOutputPath = "public/hls";
    if (videoPath) {
      const formData = new FormData();
      formData.append("Video", videoPath);
      const pythonServerUrl = "http://192.168.188.136:5000/processVideo";
      const response = await axios.post(pythonServerUrl, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Result from Python server:", response.data.hasHuman);
    }
    const path2 = uuid().substring(0, 8);
    ffmpeg(videoPath)
      .inputFormat("mp4")
      .outputFormat("hls")
      .outputOptions(["-start_number 0", "-hls_time 2"])
      .output(`${hlsOutputPath}/${path2}.m3u8`)
      .on("end", async () => {
        const newPostVideo = {
          Pemission: req.body.privacy,
          Loaction: req.body.located,
          User: req.body.userId,
          // MusicName: req.body.nameMusic,
          // VideoConten: req.body.videoConten,
          positionX: req.body.positionX,
          positionY: req.body.positionY,
          height: req.body.Height,
          width: req.body.widthV,
          inputText: req.body.textinLocation,
          VideoOrImage: `${req.protocol}://${req.get("host")}/hls/${path2}.m3u8`,
          resizeMode: req.body.resizeMode,
          Like: [
            {
              User: req.body.userId,
              Trangthai: false,
            },
          ],
        };
        try {
          const data = await new Story(newPostVideo).save();
          const originalVideoPath = path.join("public/Story", filePath);
          fs.unlink(originalVideoPath, (err) => {
            if (err) {
              console.error("Lỗi khi xóa video gốc:", err);
            } else {
              console.log("Đã xóa video gốc thành công");
            }
          });

          return res
            .status(200)
            .json({ msg: "OK", status: 200, message: "susseful" });
        } catch (err) {
          console.log(err);
          return res.status(501).json(err);
        }
      })
      .on("error", (err) => {
        console.error("Lỗi trong quá trình chuyển đổi sang HLS:", err);
        return res.status(500).json({ error: "Chuyển đổi sang HLS thất bại" });
      })
      .run();
  }
);

export default StoryVideo;
