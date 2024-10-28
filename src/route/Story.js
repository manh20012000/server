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
import protectRoute from "../middlewere/protectRoute.js";
const StoryVideo = Router();
ffmpeg.setFfmpegPath("C:\\Users\\levan\\ffmpeg\\bin\\ffmpeg.exe");
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

StoryVideo.post(
  "/uploadStory",
  protectRoute,

  uploadsVideo.single("Story"),
  async (req, res) => {
    const filePath = req.file.filename;
    console.log(req.file);
    const isImage = req.file.mimetype;
    let info = {
      protocol: req.protocol,
      host: req.get("host"),
    };
    const positionX = req.body.positionX || 50;
    const positionY = req.body.positionY || 50;
    const text = req.body.textinLocation || "";
    console.log(text, typeof text);
    const hlsOutputPath = "public/hls";
    const fullVideoPath = await path.join("public/Story", filePath);

    const path2 = uuid().substring(0, 8);
    if (isImage === "image/jpeg") {
      console.log("nahur đây với ảnh ");
      await ffmpeg(fullVideoPath)
        .loop(10) // Đặt video kéo dài 10 giây
        .inputFormat("image2")
        .outputFormat("hls")
        .outputOptions([
          "-vf",
          `drawtext=text='${text}':fontcolor=white:fontsize=24:x=${positionX}:y=${positionY},scale=-2:1080`, // Chèn văn bản và scale video
          "-c:v",
          "libx264", // Mã hóa video
          "-t",
          "10", // Độ dài video 10 giây (nếu cần)
          "-pix_fmt",
          "yuv420p", // Đảm bảo tương thích với nhiều trình phát video
          "-start_number",
          "0", // Bắt đầu từ segment số 0
          "-hls_time",
          "6", // Độ dài của mỗi phần video (tính bằng giây)
          "-hls_list_size",
          "4", // Số lượng file segment trong playlist. 0 để không giới hạn.
          "-hls_flags",
          "single_file", // Tạo một file HLS duy nhất thay vì nhiều file segment
        ])
        .output(`${hlsOutputPath}/${path2}.m3u8`)
        .on("end", async () => {
          const newPostVideo = {
            User: req.body.userId,
            height: req.body.Height,
            width: req.body.widthV,
            inputText: req.body.textinLocation,
            VideoOrImage: `${req.protocol}://${req.get(
              "host"
            )}/hls/${path2}.m3u8`,
            resizeMode: req.body.resizeMode,
            // Thumbnail,
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
          return res
            .status(500)
            .json({ error: "Chuyển đổi sang HLS thất bại" });
        })
        .run();
    } else if (isImage === "video/mp4") {
      console.log("nhảy đây với video");
      const thumbnailFileName = `${path2}_thumbnail.png`;
      const fullThumbnailPath = path.join('public/thumbnails', thumbnailFileName);
      await new Promise((resolve, reject) => {
        ffmpeg(fullVideoPath)
          .screenshot({
            count: 1, // Chỉ chụp 1 khung hình
            folder: fullThumbnailPath, // Nơi lưu thumbnail
            filename: thumbnailFileName, // Tên file thumbnail
            size: "320x240", // Kích thước của thumbnail (có thể điều chỉnh)
            timemarks: ["00:00:01.000"], // Chụp tại thời điểm 1 giây
          })
          .on("end", resolve)
          .on("error", reject);
      });
      await ffmpeg(fullVideoPath)
        .inputFormat("mp4")
        .outputFormat("hls")
        .outputOptions([
          "-vf",
          `drawtext=text='${text}':fontcolor=white:fontsize=24:x=${positionX}:y=${positionY},scale=-2:1080`, // Chèn văn bản và scale video
          "-pix_fmt",
          "yuv420p", // Đảm bảo tương thích với nhiều trình phát video
          "-start_number",
          "0", // Bắt đầu từ segment số 0
          "-hls_time",
          "6", // Độ dài của mỗi phần video (tính bằng giây)
          "-hls_list_size",
          "4", // Số lượng file segment trong playlist. 0 để không giới hạn.
          "-hls_flags",
          "single_file", // Tạo một file HLS duy nhất thay vì nhiều file segment
        ])
        .output(`${hlsOutputPath}/${path2}.m3u8`)
        .on("end", async () => {
          const newPostVideo = {
            User: req.body.userId,
            height: req.body.Height,
            width: req.body.widthV,
            inputText: req.body.textinLocation,
            VideoOrImage: `${req.protocol}://${req.get(
              "host"
            )}/hls/${path2}.m3u8`,
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
          return res
            .status(500)
            .json({ error: "Chuyển đổi sang HLS thất bại" });
        })
        .run();
    }
  }
);

export default StoryVideo;
// const videoPath = `${info.protocol}://${info.host}` + "/Story/" + filePath;
// console.log(videoPath, req.body.resizeMode);
// if (videoPath) {
//   const formData = new FormData();
//   formData.append("Video", videoPath);
//   const pythonServerUrl = "http://192.168.188.136:5000/processVideo";
//   const response = await axios.post(pythonServerUrl, formData, {
//     headers: {
//       "Content-Type": "multipart/form-data",
//     },
//   });
//   console.log("Result from Python server:", response.data.hasHuman);
// }
