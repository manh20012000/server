import { Router, query } from "express";
import multer from "multer";
import pool from "../config/connectBD.js";
import path from "path";
import appRoot from "app-root-path";
import uuid from "react-uuid";
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
const uploads = multer({ storage: storage,fileFilter: imageFilter});
// const uploads = multer({ dest:'public/uploads/' });
uploadAnh.post('/uploadAnh', uploads.array('ArayImages', 12), async (req, res) => {
    console.log(JSON.stringify(req.files))
    const Image = [];
    try {
        const fileUrl = await req.files.map((file) => {
            // Image.push("/uploads/" + file.filename);
            // console.log("trả về Image" + Image);
            return "/uploads/" + file.filename;
        }
        )
    } catch (err) {
        return res.status(500).json(err);
    }
}
)
export default uploadAnh;