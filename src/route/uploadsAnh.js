import { Router, query } from "express";
import multer from "multer";
import pool from "../config/connectBD.js";
import path from "path";
import appRoot from "app-root-path";
import db from "../config/MongoDb.js";
import uuid from "react-uuid";
import baiviet from "./api_BaiViet.js";
const uploadAnh = Router();
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null,'public/uploads/')
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + uuid().substring(0,8) + path.extname(file.originalname));
    }
  })
  const imageFilter = function (req, file, cb) {
    if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
      req.fileValidationError = 'Only image files are allowed!';
      return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
  };
const uploads = multer({ storage: storage,imageFilter:imageFilter});
// const uploads = multer({ dest:'public/uploads/' });
uploadAnh.post('/uploadAnh', uploads.array('ArayImages', 12), async (req, res) => {
    console.log(JSON.stringify(req.files)+'file')
    const Image = [];
      const imagePaths = await req.files.map((file) => {
        return "/uploads/" + file.filename;
      }); 
        console.log(imagePaths)
        const newPost ={
                Trangthai: req.body.trangThai,
                DatePost: req.body.datePost,
                Fell: req.body.feel,
                Pemission: req.body.permission,
                Loaction:: req.body.vitri,
                User: req.body.idLogin,
                Image: imagePaths      
  };
  try {
    const data = await baiviet(newPost).save();
    return res.status(200).json({ user: data[0], msg: "OK", status: 200 });
    } catch (err) {
        return res.status(500).json(err);
    }
  }
)
export default uploadAnh;