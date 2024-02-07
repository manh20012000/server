import { Router, query } from "express";
import pool from "../config/connectBD.js";
import path from "path";
import multer from "multer";
import uuid from "react-uuid";
import appRoot from "app-root-path";
import db from "../config/MongoDb.js";
import Video from "../model/Video.js";
import axios from "axios";
const VideoPost = Router();
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploadVideos/");
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

VideoPost.post(
  "/uploadVideo",
  uploadsVideo.single("Video"),
  async (req, res) => {
    const filePath = req.file.filename;
    let info = {
      protocol: req.protocol,

      host: req.get("host"),
    };
    console.log(JSON.stringify(filePath) + "anh duo tra");
    const videoPath =
      `${info.protocol}://${info.host}` + "/uploadVideos/" + filePath;
    console.log(videoPath, req.body.resizeMode);
    if (videoPath) {
      const formData = new FormData();
       formData.append('Video', videoPath);
      const pythonServerUrl = "http://192.168.188.136:5000/processVideo";
      const response = await axios.post(pythonServerUrl, formData, 
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        
      })
      console.log('Result from Python server:', response.data.hasHuman);
    
    }
    const newPostVideo = {
      DatePost: req.body.datePost,
      Pemission: req.body.privacy,
      Loaction: req.body.located,
      User: req.body.userId,
      MusicName: req.body.nameMusic,
      VideoConten: req.body.videoConten,
      positionX: req.body.positionX,
      positionY: req.body.positionY,
      height: req.body.Height,
      width: req.body.widthV,
      inputText: req.body.textinLocation,
      Video: videoPath,
      resizeMode: req.body.resizeMode,
      Like: [
        {
          User: req.body.userId,
          Trangthai: false,
        },
      ],
    };
    try {
      const data = await new Video(newPostVideo).save();
      return res
        .status(200)
        .json({ msg: "OK", status: 200, message: "susseful" });
    } catch (err) {
      console.log(err);
      return res.status(501).json(err);
    }
  }
);
export default VideoPost;
