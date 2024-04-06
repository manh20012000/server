import express from "express";
import configViewEngine from "./config/viewEngine.mjs";
import connection from "./config/connectBD.js";
import initAPIRoute from "./route/api_Taikhoan.js";
import file from "./controller/files.controller.js";
import uploadAnh from "./route/uploadsAnh.js";
import cors from "cors";
import db from "./config/MongoDb.js";
import Taikhoan from "./route/api_Taikhoan.js";
import path from "path";
import multer from "multer";
import Baiviet from "./route/api_BaiViet.js";
import baiviet from "./model/baiviet.js";
import like from "./route/api_Like.js";
import binhluan from "./route/api_Comment.js";
import VideoPost from "./route/api_PostVideo.js";
import VideoSelect from "./route/api_SlectVideo.js";
import LikeVideo from "./route/api_LikeVideo.js";
import api_CommentVideo from "./route/api_CommentVideo.js";
// import http from "http";
// import { Server } from "socket.io";
import SendNotification from "./route/Notification.js";
import StoryVideo from "./route/Story.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import MessageChat from "./route/api_Message.js";
import routerUser from "./route/user_router.js";
import { app, server } from "./socket/socket.js"
import AddFriend from "./route/api_AddFrrind.js";
import bodyParser  from "body-parser";
dotenv.config();
const port = process.env.PORT || 3000;
app.use(express.static("public"));
app.use(cors());
db.connect();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.get("/", (req, res) => {
  res.send("server is running");
});
app.use(bodyParser.json()); // for JSON data
app.use(bodyParser.urlencoded({ extended: true })); 
// tao co sơ dũ liêu với login
app.use("/", Taikhoan);
app.use("/", file);
app.use("/", uploadAnh);
app.use("/", Baiviet);
app.use("/", like);
app.use("/", binhluan);
app.use("/", VideoPost);
app.use("/", VideoSelect);
app.use("/", LikeVideo);
app.use("/", api_CommentVideo);
app.use("/", SendNotification);
app.use("/", StoryVideo);
app.use("/", MessageChat);
app.use("/", routerUser);
app.use("/", AddFriend);

server.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});















// c2 dùng trực tiếp với này và cấu hình pack.json bỏ type modun đi
// const express = require('express')
// const app = express()
// const port = 3000

// app.get('/', (req, res) => {
//   res.send('Hello World!')
// })

// app.listen(port, () => {
//   console.log(`Example app listening on port ${port}`)
// })
//app.post('/createLogin', async (req, res) => {
//     const { username, password, email } = req.body;
//     console.log('da vao')
//     let mylogin ={
//         username:username,
//         password: password,
//         email: email
//     }
//     await new login(mylogin).save();
//     return res.json(mylogin);
// })
// config gữi đa ta client lên sever và lấy 1 cách đơ giản
// app.use('/upload',file)
// gưi ảnh tư reatc native qua server
// app.use('/uploads', baiviet);

// // set up view engine
// configViewEngine(app);
// // innit wed router

// // dung cho login và và đăng ký
// app.use(express.urlencoded({ extended: true }));
// initAPIRoute(app);

const upload = multer({ dest: "public/uploads/" });
// app.post('/uploads', upload.array('ArayImages', 12), async (req, res) => {
//     console.log(JSON.stringify(req.files)+'file')
//     const Image = [];
//     const fileUrl = await req.files.map((file) => {
//         Image.push("/uploads" + file.filename);
//         console.log("trả về Image" + Image);
//         return "/uploads/" + file.filename;
//     }
//     )
// }
// )
