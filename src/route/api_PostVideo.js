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
import protectRoute from "../middlewere/protectRoute.js";
ffmpeg.setFfmpegPath("C:\\Users\\levan\\ffmpeg\\bin\\ffmpeg.exe");
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
    fileSize: 5000000000, // 10000000 Bytes = 10 MB
  },
  fileFilter(req, file, cb) {
    // upload only mp4 and mkv format
    if (
      !file.originalname.match(
        /\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF|mp4|MPEG-4|mkv)$/
      )
    ) {
      return cb(new Error("Please upload a video or image"));
    }
    cb(undefined, true);
  },
});

VideoPost.post(
  "/uploadVideo",
  protectRoute,
  uploadsVideo.single("Video"),
  async (req, res) => {
    const filePath = req.file.filename;
    console.log("req", req.file);
    let info = {
      protocol: req.protocol,
      host: req.get("host"),
    };
    const videoPath = `${info.protocol}://${info.host}/uploadVideos/${filePath}`;
    const hlsOutputPath = "public/hls";
    const thumbnailPath = "public/thumbnails"; // Thư mục lưu thumbnail
    const path2 = uuid().substring(0, 8);
    const fullVideoPath = path.join("public/uploadVideos", filePath);

    try {
      // Tạo ảnh thumbnail
      const thumbnailFileName = `${path2}_thumbnail.png`;
      const fullThumbnailPath = path.join(thumbnailPath, thumbnailFileName);

      // Sử dụng FFmpeg để trích xuất ảnh thumbnail tại giây thứ 1
      await new Promise((resolve, reject) => {
        ffmpeg(fullVideoPath)
          .screenshot({
            count: 1, // Chỉ chụp 1 khung hình
            folder: thumbnailPath, // Nơi lưu thumbnail
            filename: thumbnailFileName, // Tên file thumbnail
            size: "320x240", // Kích thước của thumbnail (có thể điều chỉnh)
            timemarks: ["00:00:01.000"], // Chụp tại thời điểm 1 giây
          })
          .on("end", resolve)
          .on("error", reject);
      });

      // Chuyển đổi video sang HLS (m3u8)
      ffmpeg(fullVideoPath)
        .inputFormat("mp4")
        .outputFormat("hls")
        .outputOptions([
          "-start_number 0",
          "-hls_time 6",
          "-hls_list_size 4",
          "-vf scale=-2:1080",
          "-hls_flags single_file",
        ])
        .output(`${hlsOutputPath}/${path2}.m3u8`)
        .on("end", async () => {
          const newPostVideo = {
            DatePost: req.body.datePost,
            Pemission: req.body.privacy,
            Loaction: req.body.located,
            User: req.body.userId,
            MusicName: req.body.nameMusic,
            VideoConten: req.body.videoConten,
            height: req.body.Height,
            width: req.body.widthV,
            Video: `${req.protocol}://${req.get("host")}/hls/${path2}.m3u8`,
            resizeMode: req.body.resizeMode,
            Thumbnail: `${req.protocol}://${req.get(
              "host"
            )}/thumbnails/${thumbnailFileName}`, // Đường dẫn đến thumbnail
            Like: [
              {
                User: req.body.userId,
                Trangthai: false,
              },
            ],
          };

          // Lưu dữ liệu video và thumbnail vào MongoDB
          const data = await new Video(newPostVideo).save();

          // Xóa file video gốc để tiết kiệm dung lượng
          const originalVideoPath = path.join("public/uploadVideos", filePath);
          fs.unlink(originalVideoPath, (err) => {
            if (err) {
              console.error("Lỗi khi xóa video gốc:", err);
            } else {
              console.log("Đã xóa video gốc thành công");
            }
          });

          return res.status(200).json({
            msg: "OK",
            status: 200,
            message: "Upload thành công",
            data,
          });
        })
        .on("error", (err, stdout, stderr) => {
          console.error("Lỗi trong quá trình chuyển đổi sang HLS:", err);
          return res
            .status(500)
            .json({ error: "Chuyển đổi sang HLS thất bại" });
        })
        .run();
    } catch (err) {
      console.log("Lỗi khi xử lý video:", err);
      return res.status(501).json({ error: "Chuyển đổi thất bại" });
    }
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
    // if (videoPath) {
      //   const formData = new FormData();
      //   formData.append("Video", videoPath);
      //   const pythonServerUrl = `http://${localhostX}:5000/processVideo`;
      //   const response = await axios.post(pythonServerUrl, formData, {
      //     headers: {
      //       "Content-Type": "multipart/form-data",
      //     },
      //   });
      //   console.log("Result from Python server:", response.data.hasHuman);
      // }
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
