import { Router, query } from "express";
import multer from "multer";
import pool from "../config/connectBD.js";
import path from "path";
import appRoot from "app-root-path";
import uuid from "react-uuid";
const baiviet = Router();
//thuc hiện post ảnh lên server
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // console.log(req.body+'destination')
    cb(null, "/uploads/");
  },
  filename: function (req, file, cb) {
    console.log(req.body+'filenam')
    cb(
      null,file.filename + "-" +uuid().substring(0, 8) +path.extname(file.originalname)      
    );
  },
});
const imageFilter = function (req, file, cb) {
  // console.log(req.body+'fimahefiter')
  if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
    req.fileValidationError = "Only image files are allowed!";
    return cb(new Error("Only image files are allowed!"), false);
  }
  cb(null, true);
};
//băt đau thuc hiẹn post file
const upload = multer({ storage: storage, fileFilter: imageFilter });
console.log(JSON.stringify(upload) + "upload");
baiviet.post("/filesPost", upload.array("ArayImages", 12), async function (req, res, next) {
  console.log(req.files +'cdjncjd')
  const { trangThai, datePost, feel, permission, vitri } = req.body;
     const ArayImages = req.files;
     console.log(datePost, idLogin, feel, permission, vitri, ArayImages);
     console.log(JSON.stringify(upload) + "thu mục uload");
    const Image = [];
    try {
      console.log( req.files + "là ");
      const fileUrl = req.files.map((file) => {
        Image.push("/uploads" + file.filename);
        console.log("trả về Image" + Image);
        return "/uploads" + file.filename;
      });
      // fileUrl.forEach( async  url => {
      //     const query = await pool.execute('insert into listImage(image,timePost,idLogin) values(?,?,?)', [url, datePost, idLogin])
      //      return res.json('Capnhat thanh cong')
      // });
    } catch (err) {
      return res.status(500);
    }
  }
);
export default baiviet;

// baiviet.post('/file', upload.array('uploaded_file', 12), async function (req, res, next) {

//     let files = req.files
//     console.log(files)
//     const fileUrls = files.map(file => {
//           return '/uploads/'+file.filename // cộng 2 cái này bằng cái đường dẫn path
//     })
//     fileUrls.forEach(async url => {
//       const query= await pool.execute(`insert into file(linkFile) values('${url}')`)
//      });
// baiviet.post('/postImage',upload.array('uploaded_file', 12),async function (req, res, next) {
//     const { idLogin,isText,datePost } = req.body
//     const postUpLoad = await pool.execute(`insert into baiviet(status,datePost,idLogin) values(?,?,?)`, [isText,datePost,idLogin]),

// })
// ;baiviet.get('/getBaiViet', async function (req, res, next) {
//     try {
//         const query = await pool.execute('select email,hoten,birth,gender,avata,baiviet.datePost,trangThai,permission,feel,idlistImage,image,Location' +' from Login,baiviet,listImage where Login.idLogin=baiviet.idLogin '
//         + 'and listImage.datePost=baiviet.datePost' )

//     } catch (err) {
//         res.json(err);
//        }
//  })
// baiviet.post('/tao_bai_viet', async function (req, res, next) {
//     try {
//         const { trangThai, datePost, idLogin, permission, feel, vitri} = req.body
//          console.log(trangThai, datePost, idLogin, permission, feel, vitri)
//         const { postUpLoad } = await pool.execute(`insert into baiviet(trangThai,datePost,idLogin,permission,feel,Location) values(?,?,?,?,?,?)`, [trangThai, datePost, idLogin, permission, feel, vitri]);
//         console.log(postUpLoad + 'doantexxt')
//         return res.status(200).json({ msg: "OK", status: 200 })
//     } catch (err) {
//          return res.status(501).json('Thất bại ')
//     }
// })
