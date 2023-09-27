import { Router, query } from "express";
import multer from "multer";
import pool from "../config/connectBD.js";
import path from "path";
import appRoot from 'app-root-path';
import uuid from "react-uuid";
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
const upload = multer({ storage: storage, fileFilter: imageFilter, })
// console.log(JSON.stringify(upload)+"upload")
let file = Router();
// file.get('/getfile', async function (req, res, next) {
//   const query = await pool.execute('select linkFile from file where idfile=1')
//   return res.json(query)
// })

file.post('/file', upload.array('ArayImages', 12), async function (req, res, next) {
   const files = req.files
   console.log(JSON.stringify(req.files))                                     
  const fileUrls = files.map(file => {
        return '/uploads/'+file.filename // cộng 2 cái này bằng cái đường dẫn path 
  })
  // fileUrls.forEach(async url => {
  //   const query= await pool.execute(`insert into file(linkFile) values('${url}')`)
  // });
})
  export default file;
  // const query= await pool.execute(`insert into file(linkFile) values('')`)
 // chẹk lõi vưới thằng reques gữi lên 
  // if (req.fileValidationError) {
  //   console.log('lg1')
  //         return res.send(req.fileValidationError);
  //     }
  // else if (!req.files) {
  //   console.log('log2')
  //   return res.send('Please select an image to upload');
    
  //     }
  // else if (err instanceof multer.MulterError) {
  //   console.log('log3')
  //         return res.send(err);
  //     }
  //       else if (err) {
  //         console.log(err)
  //         return res.send(err);
  //    }
        
  // console.log(`vua upload`)
  // let info = {
  //   protocol: req.protocol,
  //   host: req.get('host'),
  //   pathname: req.originalUrl
  // }
  // let link = `${info.protocol}://${info.host}/uploads/${req?.file?.filename}`
  // console.log(link)
  //   //  const quuery= await pool.execute(`insert into file(linkFile) values('${link}')`)
  // res.json(link)



// import { Router } from "express";
// import multer from "multer";
// import pool from "../config/connectBD.js";
// import path from "path";
// import appRoot from 'app-root-path';
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, appRoot+'public/upload/')
//   },
//   filename: function (req, file, cb) {
//     cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
//   }
// })

// const imageFilter = function (req, file, cb) {
//   if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
//     req.fileValidationError = 'Only image files are allowed!';
//     return cb(new Error('Only image files are allowed!'), false);
//   }
//   cb(null, true);
// };
// const upload = multer({ storage: storage, fileFilter: imageFilter, })
// let file = Router();
// file.post('/file', upload.single('uploaded_file'), async function (req, res, next) {
//   //chẹk lõi vưới thằng reques gữi lên 
//         if (req.fileValidationError) {
//           return res.send(req.fileValidationError);
//       }
//       else if (!req.file) {
//           return res.send('Please select an image to upload');
//       }
//       else if (err instanceof multer.MulterError) {
//           return res.send(err);
//       }
//       else if (err) {
//           return res.send(err);
//      }
        
//   console.log(`vua upload`)
//   let info = {
//     protocol: req.protocol,
//     host: req.get('host'),
//     pathname: req.originalUrl
//   }
//   let link = `${info.protocol}://${info.host}/upload/${req?.file?.filename}`

//     //  const quuery= await pool.execute(`insert into file(linkFile) values('${link}')`)
//   res.json(link)
// })
// export default file;