import { Router, query } from "express";
import pool from "../config/connectBD.js";
import path from "path";
import multer from "multer";
import uuid from "react-uuid";
import appRoot from "app-root-path";
import db from "../config/MongoDb.js";
import Video from "../model/Video.js";
import axios from "axios";
import fs from "fs";
import ffmpeg from "fluent-ffmpeg";
import HLS from "hls-server";
const VideoPost = Router();
ffmpeg.setFfmpegPath(
  "C:\\Users\\levan\\ffmpeg-2024-01-24-git-00b288da73-essentials_build\\ffmpeg-2024-01-24-git-00b288da73-essentials_build\\bin\\ffmpeg.exe"
);
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log(file, req.body, "ahhahah");
    cb(null, "public/uploadVideos/");
  },
  filename: function (req, file, cb) {
    console.log(file, req.body, "ahhahah2222");
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
    console.log(file, "hahahaha", req.body);
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
    console.log(req.files, "gái trị", req.body);
    return res.status(200);
    //   const filePath = req.file.filename ?? " ";
    //   let info = {
    //     protocol: req.protocol,

    //     host: req.get("host"),
    //   };
    //   console.log(JSON.stringify(filePath) + "anh duo tra");
    //   const videoPath =
    //     `${info.protocol}://${info.host}` + "/uploadVideos/" + filePath;
    //   console.log(info.host);
    //   const localhostX = info.host.split(":")[0];
    //   const hlsOutputPath = "public/hls";
    //   // if (videoPath) {
    //   //   const formData = new FormData();
    //   //   formData.append("Video", videoPath);
    //   //   const pythonServerUrl = `http://${localhostX}:5000/processVideo`;
    //   //   const response = await axios.post(pythonServerUrl, formData, {
    //   //     headers: {
    //   //       "Content-Type": "multipart/form-data",
    //   //     },
    //   //   });
    //   //   console.log("Result from Python server:", response.data.hasHuman);
    //   // }
    //   const path2 = uuid().substring(0, 8);
    //   ffmpeg(videoPath)
    //     .inputFormat("mp4")
    //     .outputFormat("hls")
    //     .outputOptions([
    //       "-start_number 0", // Số bắt đầu cho tên file segment
    //       "-hls_time 6", // Độ dài của mỗi phần video (tính bằng giây)
    //       "-hls_list_size 0", // Số lượng file segment trong playlist. 0 để không giới hạn.
    //       "-vf scale=-2:1080", // Scale video đến độ phân giải 1080p, giữ tỷ lệ khung hình.
    //       "-hls_flags single_file", // Tạo một tệp m3u8 và không xoay vòng tên file segment
    //     ])
    //     .output(`${hlsOutputPath}/${path2}.m3u8`)
    //     .on("end", async () => {
    //       const newPostVideo = {
    //         DatePost: req.body.datePost,
    //         Pemission: req.body.privacy,
    //         Loaction: req.body.located,
    //         User: req.body.userId,
    //         MusicName: req.body.nameMusic,
    //         VideoConten: req.body.videoConten,
    //         height: req.body.Height,
    //         width: req.body.widthV,
    //         Video: `${req.protocol}://${req.get("host")}/hls/${path2}.m3u8`,
    //         resizeMode: req.body.resizeMode,
    //         Like: [
    //           {
    //             User: req.body.userId,
    //             Trangthai: false,
    //           },
    //         ],
    //       };
    //       try {
    //         const data = await new Video(newPostVideo).save();
    //         const originalVideoPath = path.join("public/uploadVideos", filePath);
    //         fs.unlink(originalVideoPath, (err) => {
    //           if (err) {
    //             console.error("Lỗi khi xóa video gốc:", err);
    //           } else {
    //             console.log("Đã xóa video gốc thành công");
    //           }
    //         });
    //         return res
    //           .status(200)
    //           .json({ msg: "OK", status: 200, message: "susseful" });
    //       } catch (err) {
    //         console.log(err);
    //         return res.status(501).json(err);
    //       }
    //     })
    //     .on("error", (err) => {
    //       console.error("Lỗi trong quá trình chuyển đổi sang HLS:", err);
    //       return res.status(500).json({ error: "Chuyển đổi sang HLS thất bại" });
    //     })
    //     .run();
  }
);
export default VideoPost;
/*import { Router, query } from "express";
import pool from "../config/connectBD.js";
import path from "path";
import multer from "multer";
import uuid from "react-uuid";
import appRoot from "app-root-path";
import db from "../config/MongoDb.js";
import Video from "../model/Video.js";
import axios from "axios";
import fs from "fs";
import ffmpeg from "fluent-ffmpeg";
import HLS from "hls-server";
const VideoPost = Router();
ffmpeg.setFfmpegPath(
  "C:\\Users\\levan\\ffmpeg-2024-01-24-git-00b288da73-essentials_build\\ffmpeg-2024-01-24-git-00b288da73-essentials_build\\bin\\ffmpeg.exe"
);
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
   
    const hlsOutputPath = "public/hls";
    if (videoPath) {
      const formData = new FormData();
       formData.append('Video', videoPath);
      const pythonServerUrl =`http://192.168.188.136:5000/processVideo`;
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
*/
