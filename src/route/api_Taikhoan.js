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
import gennerateTokenAndsetCookie from "../ultils/generateToke.js";
import protectRoute from "../middlewere/protectRoute.js";
let Taikhoan = Router();
const saltRounds = 10;
//khai báo  giúp express hiểu khai báo đươcngf link trên web
Taikhoan.post("/login", async (req, res) => {
  try {
    console.log('vào login')
    
    const User = await user.findOne({ Taikhoan: req.body.taikhoan });
    if (User) {
   
      const match = await bcrypt.compare(req.body.matkhau, User.Matkhau);
      let token = "";
      if (match) {
        token = gennerateTokenAndsetCookie(User._id, res);

        return res.status(200).json({
          data: {
            _id: User._id,
            Hoten: User.Hoten,
            Avatar: User.Avatar,
            email: User.Email,
            accessToken: token,
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
    Taikhoan: email,
    Avatar: avatar,
    Matkhau: password,
  });
  try {
    let token = " ";
    if (Register) {
      token = gennerateTokenAndsetCookie(Register._id, res);
    }

    // const data = await new user(Register).save();
    await Register.save();

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
    const searchResults = await user.find({ Hoten: { $regex: regexPattern } });
    res.status(200).json({ data: searchResults, msg: "OK", status: 200 });
  } catch (error) {
    res.status(500).json({ msg: "Internal Server Error", error: error });
  }
});
Taikhoan.get("/userInfor", protectRoute, async (req, res) => {
  try {
    const loggerInUserId = req.user._id;
    console.log(loggerInUserId);
    // Sử dụng MongoDB để tìm kiếm dữ liệu gần đúng
    const searchResults = await user.findById({ _id: loggerInUserId });

    res.status(200).json({ data: searchResults, msg: "OK", status: 200 });
  } catch (error) {
    res.status(500).json({ msg: "Internal Server Error", error: error });
  }
});
export default Taikhoan;
