import express from "express";
import mongoose from "mongoose";
import { Router, query } from "express";
import db from "../config/MongoDb.js";
import user from "../model/user.js";
import path from "path";
import multer from "multer";
import uuid from "react-uuid";
import appRoot from "app-root-path";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  gennerateTokenAndsetCookie,
  genneratefreshTokenAndsetCookie,
} from "../ultils/generateToke.js";
import protectRoute from "../middlewere/protectRoute.js";
import Notification from "../model/Notification.js";
let Taikhoan = Router();
const saltRounds = 10;
//khai báo  giúp express hiểu khai báo đươcngf link trên web
Taikhoan.post("/login", async (req, res) => {
  try {
    console.log("vào login");

    const User = await user.findOne({ Taikhoan: req.body.taikhoan });
    if (User) {
      console.log(User.Hoten, "usrtname");
      const match = await bcrypt.compare(req.body.matkhau, User.Matkhau);
      let token = "";
      let freshtoken = "";
      if (match) {
        token = gennerateTokenAndsetCookie(User._id, res);
        freshtoken = genneratefreshTokenAndsetCookie(User._id, res);
        console.log("hahahahah", match);
        return res.status(200).json({
          data: {
            _id: User._id,
            Hoten: User.Hoten,
            Avatar: User.Avatar,
            email: User.Email,
            expoPushToken: User.fcmToken,
            accessToken: token,
            refreshToken: freshtoken,
          },
          msg: "OK",
          status: 200,
        });
      } else {
        return res.status(403).json({
          msg: "Tài khoản hoặc mật khẩu không chính xác",
          status: 403,
        });
      }
    } else {
      return res
        .status(403)
        .json({ msg: "Tài khoản hoặc mật khẩu không chính xác", status: 403 });
    }
  } catch (error) {
    return res.status(500).json(error);
  }
});
//tạo tai khoanr đăng ký
Taikhoan.post("/sigin", async (req, res) => {
  const { email, phone, hoten, birth, gender, avatar, matkhau } = req.body;
  const password = await bcrypt.hash(matkhau, saltRounds);
  const User = await user.findOne({
    Taikhoan: email,
  });
  console.log(User + "  ->usser");
  if (User != null) {
    console.log("va0 ko");
    return res.status(404).json({ msg: "tài khoản đã tồn tại", status: 404 });
  }

  const Register = new user({
    Email: email,
    Phone: phone,
    Hoten: hoten,
    Birth: birth,
    Gender: gender ?? " ",
    friendRequests: [],
    Taikhoan: email,
    Avatar: avatar,
    Matkhau: password,
    fcmToken: [],
  });
  try {
    console.log("thêm mới ", Register._id);
    let token = " ";
    if (Register) {
      token = gennerateTokenAndsetCookie(Register._id, res);
    }
    console.log("thanh công");
    // const data = await new user(Register).save();
    await Register.save();
    console.log("thanh côn2222g");
    return res.status(200).json({
      data: {
        email: Register.email,
        _id: Register._id,
        userName: Register.Hoten,
        accesstoken: token,
      },
      msg: "OK",
      status: 200,
    });
  } catch (error) {
    console.log("loi", error);
    return res.status(500).json("loi");
  }
});
// câp nhayt anh
const storag = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/upload/");
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
const imageFilter = function (req, file, cb) {
  if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
    req.fileValidationError = "Only image files are allowed!";
    return cb(new Error("Only image files are allowed!"), false);
  }
  cb(null, true);
};

let upload = multer({ storage: storag, imageFilter: imageFilter });
Taikhoan.post("/UpadateAvatar", upload.single("Avatar"), async (req, res) => {
  try {
    console.log("UpadateAvatar");
    let info = {
      protocol: req.protocol,
      host: req.get("host"),
    };
    const _id = req.body.iduser;
    // console.log(_id);
    const avatarUrl =
      `${info.protocol}://${info.host}` + "/upload/" + req.file.filename;
    // console.log(avatarUrl);
    const User = await user.findByIdAndUpdate(
      _id,
      { Avatar: avatarUrl },
      { new: true }
    );

    return res.status(200).json({ status: 200, data: User, mess: "sussesful" });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Lỗi cập nhật ảnh đại diện." + error });
  }
});
Taikhoan.post("/logout", async (req, res) => {
  try {
    req.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "logout success" });
  } catch (error) {}
});
Taikhoan.post("/SearchMention", async (req, res) => {
  try {
    const searchTerm = req.body.Textseach;
    // Sử dụng biểu thức chính quy để tạo mẫu tìm kiếm gần đúng
    const regexPattern = new RegExp(searchTerm, "i"); // 'i' để không phân biệt hoa thường
    // Sử dụng MongoDB để tìm kiếm dữ liệu gần đúng
    const searchResults = await user
      .find({ Hoten: { $regex: regexPattern } })
      .select(
        "-Matkhau -fcmToken -userFrieds -friendRequests -userFollowing -idVideoLike -Email -Phone "
      );
    const formattedResults = searchResults.map((user) => ({
      id: user._id, // Hoặc thuộc tính nào đó để lấy ID
      name: user.Hoten,
      username: user.Hoten, // Giả sử TenDangNhap là trường username
      gender: user.Gender, // Giả sử GioiTinh là trường gender
    }));

    res.status(200).json({ data: formattedResults, msg: "OK", status: 200 });
  } catch (error) {
    res.status(500).json({ msg: "Internal Server Error", error: error });
  }
});
Taikhoan.post("/userInfor", protectRoute, async (req, res) => {
  try {
    const loggerInUserId = req.user._id;
    // Sử dụng MongoDB để tìm kiếm dữ liệu gần đúng
    const searchResults = await user.findById({ _id: loggerInUserId });
    // console.log(searchResults);
    res.status(200).json({ data: searchResults, msg: "OK", status: 200 });
  } catch (error) {
    res.status(500).json({ msg: "Internal Server Error", error: error });
  }
});
Taikhoan.post("/userfind", protectRoute, async (req, res) => {
  try {
    const loggerInUserId = req.body._id;
    // Sử dụng MongoDB để tìm kiếm dữ liệu gần đúng
    const searchResults = await user.findById({ _id: loggerInUserId });
    // console.log(searchResults);
    res.status(200).json({ data: searchResults, msg: "OK", status: 200 });
  } catch (error) {
    res.status(500).json({ msg: "Internal Server Error", error: error });
  }
});

Taikhoan.post("/userfindByid", protectRoute, async (req, res) => {
  try {
    // đoạn code này thục hiện với thông báo nha

    const { isRead, notificationId, sendId } = req.body;
    // Sử dụng MongoDB để tìm kiếm dữ liệu gần đúng
    const isreadNotifi = isRead === "true";
    console.log(isreadNotifi, typeof isreadNotifi, isRead, typeof isRead);
    const searchResults = await user.findById({ _id: sendId });
    console.log("hạhdjshdjshdjs");
    const updateNotification = await Notification.findByIdAndUpdate(
      notificationId,
      {
        isread: true,
      },
      {
        new: true,
      }
    );
    console.log("hạhdjshdjsh234567898765djs");
    res.status(200).json({ data: searchResults, msg: "OK", status: 200 });
  } catch (error) {
    res.status(500).json({ msg: "Internal Server Error", error: error });
  }
});
Taikhoan.post("/user/refreshToken", async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken)
    return res.status(401).json({ err: "No refresh token provided" });
  const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);

  if (!decoded) {
    return res.status(404).json({ err: "authorized- invalid Token" });
  }

  const users = await user.findById(decoded.userId).select("-Matkhau");
  if (!users) {
    return res.status(404).json({ err: "user Notfound" });
  }

  let token = gennerateTokenAndsetCookie(users._id, res);
  return res.status(200).json({
    data: {
      _id: users._id,
      Hoten: users.Hoten,
      Avatar: users.Avatar,
      email: users.Email,
      expoPushToken: users.fcmToken,
      accessToken: token,
      refreshToken: refreshToken,
    },
    msg: "OK",
    status: 200,
  });
});
Taikhoan.put("/user/upadateFCMtoken/:id", async (req, res) => {
  const User_id = req.params.id;
  const fcmtoken = req.body.expoPushToken;
  console.log(fcmtoken, "gias tri fcmtoken", User_id);
  try {
    const User = await user.findByIdAndUpdate(
      User_id,
      { fcmToken: fcmtoken },
      { new: true, select: "-password" }
    );
    if (!user) return res.status(404).json({ msg: "User not found" });
    console.log("User " + User._id + " updated fcmToken successfully");
    return res.status(200).json({
      data: {
        _id: User._id,
        Hoten: User.Hoten,
        Avatar: User.Avatar,
        email: User.Email,
        expoPushToken: User.fcmToken,
      },
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
});
// Taikhoan.get("/user/checkAcceptFriend/:id", async (req, res) => {
//   const User_id = req.params.id;
//   try {
//     const user = await user.findById(User_id).select("AcceptFriend");
//     if (!user) {
//       return res.status(404).json({ msg: "User not found" });
//     }
//     const acceptFriendStatus = user.AcceptFriend.map((friend) => ({
//       friendId: friend._id,
//       statusAfriend: friend.statusAfriend,
//     }));
//     return res.status(200).json({ data: acceptFriendStatus });
//   } catch (e) {
//     console.log(e);
//     return res.status(500).json({ msg: "Internal Server Error" });
//   }
// });
Taikhoan.put("/user/getUser/:id", protectRoute, async (req, res) => {
  const User_id = req.params.id;
  const fcmtoken = req.body.expoPushToken;
  console.log(fcmtoken, "gias tri fcmtoken", User_id);
  try {
    await user.findByIdAndUpdate(
      User_id,
      { fcmToken: fcmtoken },
      { new: true, select: "-password" },
      function (err, docs) {
        console.log(docs);
        if (err) {
          return res.status(400).json({ msg: "server not found user" });
        } else {
          return res.status(200).json({ data: docs });
        }
      }
    );
  } catch (e) {
    console.log(e);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
});
export default Taikhoan;
