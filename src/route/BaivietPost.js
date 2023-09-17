import{ Router, query } from "express";
import multer from "multer";
import pool from "../config/connectBD.js";
import path from "path";
import appRoot from 'app-root-path';
import { uuid } from "uuidv4";
const baiviet = Router();
baiviet.post('/tao_bai_viet', async function (req, res, next) { 
    const {  isText, datePost,idLogin } = req.body
    console.log(idLogin, isText, datePost)
    const postUpLoad = await pool.execute(`insert into baiviet(trangThai,datePost,idLogin) values(?,?,?)`, [isText, datePost, idLogin]);
    console.log(postUpLoad)
    return res.status(200).json({ data: postUpLoad[0], msg: "OK", status: 200 })
})
//thuc hiện post ảnh lên server
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

baiviet.post('/file', upload.array('uploaded_file', 12), async function (req, res, next) {

    let files = req.files
    console.log(files)
    const fileUrls = files.map(file => {
          return '/uploads/'+file.filename // cộng 2 cái này bằng cái đường dẫn path 
    })
    fileUrls.forEach(async url => {
      const query= await pool.execute(`insert into file(linkFile) values('${url}')`)
     });
baiviet.post('/postImage',upload.array('uploaded_file', 12),async function (req, res, next) { 
    const { idLogin,isText,datePost } = req.body
    const postUpLoad = await pool.execute(`insert into baiviet(status,datePost,idLogin) values(?,?,?)`, [isText,datePost,idLogin]),
     

})
export default baiviet;