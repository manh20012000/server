import express from "express";
import mongoose from "mongoose";
import { Router, query } from "express";
import db from "../config/MongoDb.js";
import user from "../model/user.js";
import baiviet from "../model/baiviet.js";
import Comment from "../model/Comment.js";
import Like from "../model/Likecmt.js";
const binhluan = Router();


binhluan.post("/selectDataCmt", async (req, res) => {
  try {
    let myComments = await Comment.find({IdBaiviet: req.body.idBaiPost})
          .populate({path: 'CommentChildren', populate: { path: 'User'}})
           .populate({path: 'User'})     
    
  return res.status(200).json({ data: myComments, status: 200, message: "oki." });
  } catch (err) {
    return res.status(500).json(err);
  }
});



binhluan.post("/SendBinhluan", async (req, res) => {
  const idUser = req.body.UserCmt; // Lấy id của người dùng
  const idBaiPost = req.body.idBaiviet; // Lấy id của bài viết
  const soluongcmt = req.body.Soluongcmt; // Lấy số lượng tym
  const Noidung = req.body.Noidung; // Lấy trạng thái like
  const IdComment = req.body.idComent;
  try {
    let baiViet = await baiviet.findOne({_id: idBaiPost});

    if (baiViet) {
          baiViet.SoluongCmt = soluongcmt;
      await baiViet.save(); 
    
      if (IdComment) {
        let DadyComment =await Comment.findById(IdComment);
        let childComment = await new Comment({
                      User: idUser,
                      Content: Noidung,
                      CommentChildren: [],
                      IdBaiviet: idBaiPost,
                      idLike: []
        }).save();
               DadyComment.CommentChildren.push(childComment._id);
               await DadyComment.save(); 
        
               let myComments = await Comment.find({IdBaiviet: idBaiPost})
                    .populate({path: 'CommentChildren', populate: { path: 'User'}})
                    .populate({path: 'User'})
                      
             return res.status(200).json({ data: myComments, status: 200, message: "oki." });

      } else {
        let CommentDady = await new Comment({
                User: idUser,
                Content: Noidung,
                CommentChildren: [],
                IdBaiviet: idBaiPost,
                idLike: []
        }).save();

        let myComments = await Comment.find({IdBaiviet: idBaiPost})
                  .populate({path: 'CommentChildren', populate: { path: 'User'}})
                  .populate({path: 'User'})
                    
      return res.status(200).json({ data: myComments, status: 200, message: "oki." });
      }
    } else {
      return res.status(500).json({ status: 500, message: "sever lỗi." });
    }
  } catch (err) {
    return res.status(500).json(err);
  }
});
export default binhluan;

















































































// binhluan.post("/selectUser", async (req, res) => {
//   try {
//     const allPosts = await user.findById(req.body.idUser).populate("User");

//     if (allPosts) {
//       return res
//         .status(200)
//         .json({ data: allPosts, message: "lấy user thành công" });
//     } else if (!allPosts) {
//       return res.status(404).json({ message: "Bài viết không tồn tại" });
//     }
//   } catch (err) {
//     return res.status(500).json(err);
//   }
// });

// binhluan.post('/SelectCmtChildren',async (req, res) => {
//   const timIdbaiviet = req.body.Idbaiviet;
//   const timIdCmtcha = req.body.idcmtCha;
//   const idUser = req.body.UserCmt; // Lấy id của người dùng
//         const soluongcmt = req.body.Soluongcmt; // Lấy số lượng tym
//         const Noidung =req.body.Noidung; // Lấy trạng thái like
//   try {
//     const allPosts = await baiviet.findById(timIdbaiviet)
//     if (allPosts) {
//       const idcommentcha = await allPosts.Comment.findById(timIdCmtcha).populate('User');
//       if (idcommentcha) {
//         idcommentcha.CommentChildren.push({ User: idUser, Content: Noidung });
//         await allPosts.save();
//         return res.status(200).json({ data:idcommentcha,message: 'Bình luận con đã được thêm' });
//       }
//     } else if (!allPosts) {
//       return res.status(404).json({ message: 'Bài viết không tồn tại' });
//     }
//   } catch (err) {
//     return res.status(500).json(err);
//   }

// }
// binhluan.post("/SendBinhluan", async (req, res) => {
//   const idUser = req.body.UserCmt; // Lấy id của người dùng
//   const idBaiPost = req.body.idBaiviet; // Lấy id của bài viết
//   const soluongcmt = req.body.Soluongcmt; // Lấy số lượng tym
//   const Noidung = req.body.Noidung; // Lấy trạng thái like
//   const IdComment = req.body.idComent;
//   console.log(idUser, idBaiPost, soluongcmt, Noidung, IdComment);
//   try {
//     const baiViet = await baiviet.findById(idBaiPost);
//     if (baiViet) {;
//       if (IdComment) {
//             console.log('nhay vào them mơi1');
//             baiViet.Comment.push({ User: idUser, Content: Noidung, SoluongThich: 0, CommentChildren: IdComment });
//             baiViet.SoluongCmt = soluongcmt;
//             const kiemtra = await baiViet.save();
//         const data = await baiviet.findById(idBaiPost).populate({ path: 'Comment', populate: { path: 'User',   }  })
//         return res.status(200).json({ data: data.Comment, status: 200, message: "oki." });

//       } else {
//         console.log('nhay vào them mơi');
//         baiViet.Comment.push({ User: idUser, Content: Noidung, SoluongThich: 0, CommentChildren: null });
//         baiViet.SoluongCmt = soluongcmt;
//         const kiemtra = await baiViet.save();
//         const data = await baiviet.findById(idBaiPost).populate({ path: 'Comment', populate: { path: 'User',   }  })
//         return res.status(200).json({ data: data.Comment, status: 200, message: "oki." });
//       }
//     } else {
//       return res.status(404).json({ message: "Bài viết không tồn tại" });
//     }
//   } catch (err) {
//     return res.status(500).json(err);
//   }
// });
// export default binhluan;
// binhluan.post("/SendBinhluan", async (req, res) => {
//   try {
//     const idUser = req.body.UserCmt; // Lấy id của người dùng
//     const idBaiPost = req.body.idBaiviet; // Lấy id của bài viết
//     const soluongcmt = req.body.Soluongcmt; // Lấy số lượng tym
//     const Noidung = req.body.Noidung; // Lấy trạng thái like
//     console.log(idUser, idBaiPost, soluongcmt, Noidung);
//     const baiViet = await baiviet.findById(idBaiPost);

//     if (!baiViet) {
//       return res.status(404).json({ message: "ljonh tim thay binhluan" });
//     }

//     baiViet.Comment.push({ User: idUser, Content: Noidung });
//     baiViet.SoluongCmt = soluongcmt;

//     const kiemtra = await baiViet.save();
//     return res
//       .status(200)
//       .json({ data: kiemtra.Comment, status: 200, message: "oki." });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ message: "Lỗi server." });
//   }
// });
