import { Router, query } from "express";
import multer from "multer";
import pool from "../config/connectBD.js";
import path from "path";
import appRoot from "app-root-path";
import uuid from "react-uuid";
const baiviet = Router();
//thuc hiện post ảnh lên server
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     // console.log(req.body+'destination')
//     cb(null, "./public/uploads/");
//   },
//   filename: function (req, file, cb) {
//     // console.log(req.body+'filenam')
//     cb(
//       null,file.filename + "-" +uuid().substring(0, 8) +path.extname(file.originalname)      
//     );
//   },
// });
// const imageFilter = function (req, file, cb) {
//   // console.log(req.body+'fimahefiter')
//   if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
//     req.fileValidationError = "Only image files are allowed!";
//     return cb(new Error("Only image files are allowed!"), false);
//   }
//   cb(null, true);
// };
// //băt đau thuc hiẹn post file
// const upload = multer({ storage: storage, fileFilter: imageFilter });
// console.log(JSON.stringify(upload) + "upload");
// baiviet.post("/filesPost", upload.array("ArayImages", 12), async function (req, res, next) {
//   console.log(req.files +'cdjncjd')
//   const { trangThai, datePost, feel, permission, vitri } = req.body;
//      const ArayImages = req.files;
//      console.log(datePost, idLogin, feel, permission, vitri, ArayImages);
//      console.log(JSON.stringify(upload) + "thu mục uload");
//     const Image = [];
//     try {
//       console.log( req.files + "là ");
//       const fileUrl = req.files.map((file) => {
//         Image.push("/uploads" + file.filename);
//         console.log("trả về Image" + Image);
//         return "/uploads" + file.filename;
//       });
//       // fileUrl.forEach( async  url => {
//       //     const query = await pool.execute('insert into listImage(image,timePost,idLogin) values(?,?,?)', [url, datePost, idLogin])
//       //      return res.json('Capnhat thanh cong')
//       // });
//     } catch (err) {
//       return res.status(500);
//     }
//   }
// );
// export default baiviet;


baiviet.post('/filesPost', async function (req, res, next) {
    try {
      const { trangThai, datePost, feel, permission, vitri,ArayImages } = req.body; = req.body
         console.log(trangThai, datePost, feel, permission, vitri,ArayImages)
        const { postUpLoad } = await pool.execute(`insert into baiviet(trangThai,datePost,idLogin,permission,feel,Location) values(?,?,?,?,?,?)`, [trangThai, datePost, idLogin, permission, feel, vitri]);
        console.log(postUpLoad + 'doantexxt')
        return res.status(200).json({ msg: "OK", status: 200 })
    } catch (err) {
         return res.status(501).json('Thất bại ')
    }
})
export default baiviet;