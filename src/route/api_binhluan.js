import express from "express";
import mongoose from "mongoose";
import { Router, query } from "express";
import db from "../config/MongoDb.js";
import user from "../model/user.js";
import baiviet from "../model/baiviet.js";
const binhluan = Router();
binhluan.post("/binhluanPost", async (req, res) => {
  try {
    const kiemtra = await baiviet
      .findOneAndUpdate(
        { _id: req.body.idBaiPost, "binhluan.User": req.body.idUser },
        {
          $inc: { SoluongCmt: req.body.SoluongCmt },
          $push: {
            binhluan: { User: req.body.idUser, Content: req.body.Content },
          },
        },
        { new: true } //  bai viet được cập nhâtj
      )
      .populate("User");
    if (!kiemtra) {
      console.log("nguoi dung chưa tồn tain và");
      const newbinhluan = {
        User: req.body.idUser,
        Content: req.body.Content,
      };
      kiemtra.binhluan.push(newbinhluan);
      kiemtra.SoluongCmt += 1;
    }
    await kiemtra.save();
    return res.status(200).json({ data: kiemtra, message: "binhluan." });
  } catch (err) {
    return res.status(500).json(err);
  }
});


binhluan.post("/selectUser", async (req, res) => {
  try {
    const allPosts = await user.findById(req.body.idUser).populate("User");
    const swappedPosts = allPosts;
    if (allPosts) {
      return res
        .status(200)
        .json({ data: swappedPosts, message: "lấy user thành công" });
    } else if (!allPosts) {
      return res.status(404).json({ message: "Bài viết không tồn tại" });
    }
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
  console.log(idUser, idBaiPost, soluongcmt, Noidung, IdComment);
  try {
    const baiViet = await baiviet.findById(idBaiPost);
    if (baiViet) {;
      if (IdComment) {
            console.log('nhay vào them mơi1');
            baiViet.Comment.push({ User: idUser, Content: Noidung, SoluongThich: 0, CommentChildren: IdComment });
            baiViet.SoluongCmt = soluongcmt;
            const kiemtra = await baiViet.save();
        const data = await baiviet.findById(idBaiPost).populate({ path: 'Comment', populate: { path: 'User',   }  })
        return res.status(200).json({ data: data.Comment, status: 200, message: "oki." });
      
      } else {
        console.log('nhay vào them mơi');
        baiViet.Comment.push({ User: idUser, Content: Noidung, SoluongThich: 0, CommentChildren: null });
        baiViet.SoluongCmt = soluongcmt;
        const kiemtra = await baiViet.save();
        const data = await baiviet.findById(idBaiPost).populate({ path: 'Comment', populate: { path: 'User',   }  })
        return res.status(200).json({ data: data.Comment, status: 200, message: "oki." });
      }
    } else {
      return res.status(404).json({ message: "Bài viết không tồn tại" });
    }
  } catch (err) {
    return res.status(500).json(err);
  }
});
export default binhluan;






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
