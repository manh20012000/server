import express from "express";
import mongoose from "mongoose";
import { Router, query } from "express";
import db from "../config/MongoDb.js";
import user from "../model/user.js";
import path from "path";
import multer from "multer";
import uuid from "react-uuid";
import appRoot from "app-root-path";
let Taikhoan = Router();
//khai báo  giúp express hiểu khai báo đươcngf link trên web
Taikhoan.post("/login", async (req, res) => {
  try {
    // await db.collection('user').findOne({taikhoan:req.body.taikhoan,matkhau: req.body.matkhau})
    const User = await user.findOne({
      Taikhoan: req.body.taikhoan,
      Matkhau: req.body.matkhau,
    });
    console.log(User);
    if (User != null) {
      return res.status(200).json({ data: User, msg: "OK", status: 200 });
    } else {
      return res
        .status(403)
        .json({ msg: "Tài khoản hoặc pass không chính sác", status: 403 });
    }
  } catch (error) {
    return res.status(500).json(error);
  }
});
//tạo tai khoanr đăng ký
Taikhoan.post("/sigin", async (req, res) => {
  const User = await user.findOne({
    Taikhoan: req.body.taikhoan,
    Matkhau: req.body.matkhau,
  });
  console.log(User + "  ->usser");
  if (User != null) {
    console.log("va0 ko");
    return res.status(404).json({ msg: "tài khoản đã tồn tại", status: 404 });
  }
  console.log("haaha");
  const { email, phone, hoten, birth, gender, taikhoan, avatar, matkhau } =
    req.body;
  const Register = {
    Email: email,
    Phone: phone,
    Hoten: hoten,
    Birth: birth,
    Gender: gender,
    Taikhoan: taikhoan,
    Avatar: avatar,
    Matkhau: matkhau,
  };
  try {
    const data = await new user(Register).save();
    return res.status(200).json({ user: data[0], msg: "OK", status: 200 });
  } catch (error) {
    return res.status(500).json("loi");
  }
});
// câp nhayt anh cho firebase

const storag = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/upload/");
  },
  filename: function (req, file, cb) {
      cb(
        null,file.fieldname +"-" +uuid().substring(0, 8) +path.extname(file.originalname)
      );
    },
 })
 const imageFilter = function (req, file, cb) {
  if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
    req.fileValidationError = "Only image files are allowed!";
    return cb(new Error("Only image files are allowed!"), false);
  }
  cb(null, true);
};
let upload = multer({ storage: storag,imageFilter:imageFilter});
Taikhoan.post("/UpadateAvatar", upload.single('Avatar'), async (req, res) => { 
try {
let info = {
protocol: req.protocol,
host: req.get("host"),
  }; 
  const _id = req.body.iduser;
  
const avatarUrl = `${info.protocol}://${info.host}` + "/upload/" + req.file.filename;
 console.log(avatarUrl)
const User = await user.findByIdAndUpdate(_id, { Avatar: avatarUrl }, { new: true });
res.status(200).json({ status: 200, data:User });
console.log(User)
} catch (error) {
console.error(error);
res.status(500).json({ success: false, message: 'Lỗi cập nhật ảnh đại diện.' });
}
})
export default Taikhoan;
