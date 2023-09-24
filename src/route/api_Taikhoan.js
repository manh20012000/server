import express from "express";
import mongoose from 'mongoose';
import { Router, query } from "express";
import db from "../config/MongoDb.js";
import user from "../model/user.js";
let Taikhoan = Router();
//khai báo  giúp express hiểu khai báo đươcngf link trên web 
    Taikhoan.post('/login',async (req, res) => {
        try {           // await db.collection('user').findOne({taikhoan:req.body.taikhoan,matkhau: req.body.matkhau})
          const User =  await user.findOne({ Taikhoan: req.body.taikhoan, Matkhau:req.body.matkhau })
          console.log(
            
          );
           if (User !=null) {
            return res.status(200).json({ data: User[0], msg: "OK", status: 200 });
          } else  {
            return res
              .status(404).json({ msg: "Tài khoản hoặc pass không chính sác", status: 404 });
          }
        } catch (error) {
          return res.status(500).json(error);
        }
    })
//tạo tai khoanr đăng ký 
Taikhoan.post('/sigin', async (req, res) => {
  const Log =  user.findOne({ taikhoan: req.body.taikhoan, matkhau:req.body.matkhau })
  console.log(JSON.stringify(Log))
    if (Log!=null) {
    return res.status(404).json({ msg: "tài khoản đã tồn tại", status: 404 });
  }
 
         const { email, phone, hoten, birth, gender, taikhoan, avatar, matkhau } = req.body;
        const Register = {
              Email:email,
              Phone:phone,
              Hoten:hoten,
              Birth:birth,
              Gender:gender,
              Taikhoan:taikhoan,
              Avatar:avatar,
              Matkhau:matkhau,
            }
        try {
        const data = await new user(Register).save();
          return res.status(200).json({ user: data[0], msg: "OK", status: 200 });
        } catch (error) {
          return res.status(500).json("loi");
        }
      })
export default Taikhoan;