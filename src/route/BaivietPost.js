import{ Router, query } from "express";
import multer from "multer";
import pool from "../config/connectBD.js";
import path from "path";
import appRoot from 'app-root-path';
import { uuid } from "uuidv4";
const baiviet = Router();
// thuc hien lay bai viet ve du lieu
// baiviet.get('/getBaiViet', async function (req, res, next) {
//     try {
//         const query = await pool.execute('select * from Login,baiviet,listImage where Login.idLogin=baiviet.idLogin 
//        'and Login.idLogin=listImage.idLogin and listImage.timePost=baiviet.datePost')
          
//     } catch (err) {
//         res.json(err);
//        }
//  })
baiviet.post('/tao_bai_viet', async function (req, res, next) { 
    try {
        const { trangThai, datePost, idLogin, permission, feel, vitri,image} = req.body
         console.log(trangThai, datePost, idLogin, permission, feel, vitri,image)
        const { postUpLoad } = await pool.execute(`insert into baiviet(trangThai,datePost,idLogin,permission,feel,Location,image) values(?,?,?,?,?,?)`, [trangThai, datePost, idLogin, permission, feel, vitri,image]);
        console.log(postUpLoad + 'doantexxt')
        return res.status(200).json({ msg: "OK", status: 200 })
    } catch (err) {
         return res.status(501).json('Thất bại ')
    }
})
//thuc hiện post ảnh lên server
// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null,'public/uploads/')
//     },
//     filename: function (req, file, cb) {
//       cb(null, file.fieldname + '-' + uuid().substring(0,8) + path.extname(file.originalname));
//     }
//   })
//   const imageFilter = function (req, file, cb) {
//     if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
//       req.fileValidationError = 'Only image files are allowed!';
//       return cb(new Error('Only image files are allowed!'), false);
//     }
//     cb(null, true);
// };
// //băt đau thuc hiẹn post file
// const upload = multer({ storage: storage, fileFilter: imageFilter, })
// baiviet.post('/filePost', upload.array('uploaded_file', 12), async function (req, res, next){
//     try {
//         console.log(req.body);
//         const { idLogin, image, datePost } = req.body;
//             let files = image;
//             console.log(files);
//             const fileUrl = files.map(file => {
//             return '/uploads' + file.fieldname;
//         })
//         fileUrl.forEach( async  url => {
//             const query = await pool.execute('insert into listImage(image,timePost,idLogin) values(?,?,?)', [url, datePost, idLogin])
//              return res.json('Capnhat thanh cong')
//         });
//      } catch (err) {
//       return res.status(500);
//     }
// })
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
export default baiviet;