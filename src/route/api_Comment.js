import express from "express";
import mongoose from "mongoose";
import { Router, query } from "express";
import path from "path";
import multer from "multer";
import uuid from "react-uuid";
import appRoot from "app-root-path";
import db from "../config/MongoDb.js";
import user from "../model/user.js";
import baiviet from "../model/baiviet.js";
import Comment from "../model/Comment.js";
import Like from "../model/Likecmt.js";
import handlerFunction from "./api_functionNotification.js";
import protectRoute from "../middlewere/protectRoute.js";
import Notification from "../model/Notification.js";
const binhluan = Router();

binhluan.post("/selectDataCmt", async (req, res) => {
  try {
    let myComments = await Comment.find({ IdBaiviet: req.body.idbaiviet })
      .populate({
        path: "comments",
        populate: { path: "User" }, // Populate toàn bộ object của comment con
      })
      .populate("User");

    // console.log(myComments, 'hahaobdh');

    return res
      .status(200)
      .json({ data: myComments, status: 200, message: "Success." });
  } catch (err) {
    console.log(err, "Error log");
    return res.status(500).json(err);
  }
});

// send du lieu voi comment
const storag = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/upload/");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname +
        "-" +
        uuid().substring(0, 8) +
        path.extname(file.originalname)
    );
  },
});
const imageFilter = function (req, file, cb) {
  if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
    req.fileValidationError = "Only image files are allowed!";
    return cb(new Error("Only image files are allowed!"), false);
  }
  cb(null, true);
};

let upload = multer({ storage: storag, imageFilter: imageFilter });
binhluan.post(
  "/SendCommentArticles",
  protectRoute,
  upload.single("imageCmt"),
  async (req, res) => {
    // binhluan.post("/SendComment", async (req, res) => {

    try {
      const id = req.body._id;
      const idUser = req.body.UserCmt;
      const idBaiPost = req.body.idBaiviet;
      const soluongcmt = req.body.Soluongcmt;
      const Noidung = req.body.Noidung;
      const nameComemnt = req.body.nameComemnt;
      const parentIdString = req.body.parentId; // Lấy chuỗi từ FormData
      const IdComment = JSON.parse(parentIdString);
      const title = req.body.title;
      const avatarSend = req.body.avatarSend;
      const messagenotifi = req.body.messagenotifi;
      // console.log(idBaiPost, IdComment, Noidung, " properties");
      let info = {
        protocol: req.protocol,
        host: req.get("host"),
      };
      const avatarUrl = req.file
        ? `${info.protocol}://${info.host}` + "/upload/" + req.file.filename
        : null;

      let baiViet = await baiviet.findOne({ _id: idBaiPost });
      if (!baiViet) {
        return res.status(404).json({ message: "Không tìm thấy bài viết." });
      }
      if (baiViet) {
        baiViet.SoluongCmt = soluongcmt;
        await baiViet.save();
        const userAtical = await user.findById(baiViet.User);
        if (!userAtical) return res.status(403);
        try {
          await handlerFunction(
            userAtical.fcmToken,
            title,
            `${nameComemnt || "Người dùng"} comment bài viết `,
            {
              type: "thả tim video ",
              from: nameComemnt,
              someData: "goes here",
            }
          );
        } catch (e) {
          console.error("L��i gửi thông báo: ", e);
        }
        console.log("gữi thông báo thành công với đoạn mã này ");
        // console.log("nhày vào đay đàu tiên ", IdComment, typeof IdComment);
        if (IdComment) {
          // console.log("nhày vào đay đàu tiên11 ", IdComment, typeof IdComment);
          let DadyComment = await Comment.findById(IdComment);
          console.log(req.body._id, "gía trị id mới là ");
          let childComment = await new Comment({
            _id: req.body._id,
            User: idUser,
            Content: Noidung,
            idLike: [],
            Image: avatarUrl,
          }).save();
          DadyComment.comments.push(req.body._id);
          await DadyComment.save();
          console.log("da nbab");

          return res.status(200).json({ status: 200, message: "oki." });
        } else {
          let CommentDady = await new Comment({
            _id: req.body._id,
            User: idUser,
            Content: Noidung,
            comments: [],
            IdBaiviet: idBaiPost,
            idLike: [],
            Image: avatarUrl,
          });

          if (id !== idUser) {
            await new Notification({
              reciveId: userAtical._id,
              sendId: idUser,
              isRead: false,
              title: title,
              idOjectModel: idBaiPost,
              messageNotifi: messagenotifi,
              thumbnailObject: baiViet.thumbnail ?? null, // Nếu baiViet.thumbnail là null hoặc undefined, trả về null
              avatarSend: avatarSend,
            }).save();
          }
          await Promise.all([CommentDady.save()]);
          console.log("nhày vào đay 3 ");

          return res.status(200).json({ status: 200, message: "oki." });
        }
      } else {
        return res.status(500).json({ status: 500, message: "sever lỗi." });
      }
    } catch (err) {
      console.log(err, "loi da catch");
      return res.status(500).json(err);
    }
  }
);

binhluan.post("/deleteComment", async (req, res) => {
  console.log("nhay vao dya");
  try {
    const commentId = req.body.idComemnt;
    const idCmtChildrenInArr = req.body.idPerent;

    if (req.body.DinhDanh == "Children") {
      const deletedChildrenComment = await Comment.findByIdAndRemove(commentId);
      const deletedParentComment = await Comment.findById(idCmtChildrenInArr);
      deletedParentComment.CommentChildren =
        deletedParentComment.CommentChildren.filter((item) => {
          return item._id.toString() !== deletedChildrenComment._id.toString();
        });
      await deletedParentComment.save();
      return res
        .status(200)
        .json({ message: "đã được cập nhật ", data: deletedParentComment });
    } else if (req.body.DinhDanh == "Parent") {
      const deletedComment = await Comment.findByIdAndRemove(commentId);

      console.log(deletedComment);
      if (deletedComment) {
        return res
          .status(200)
          .json({ data: deletedComment, message: "Bình luận đã được xóa" });
      } else {
        return res.status(404).json({ message: "Không tìm thấy bình luận" });
      }
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Lỗi khi xóa bình luận", error: error });
  }
});
export default binhluan;

// try {
//     const deletedComment = await Comment.findByIdAndRemove(req.body.idComemnt);

//     if (deletedComment) {
//       console.log(deletedComment)
//       return res.status(200).json({ message: 'Bình luận đã được xóa' });
//     } else {
//       return res.status(404).json({ message: 'Không tìm thấy bình luận' });
//     }
//   } catch (error) {
//     return res.status(500).json({ message: 'Lỗi khi xóa bình luận', error: error });
//   }

// Comment.findOneAndUpdate(
//       { _id: commentId },
//       { $pull: { CommentChildren: childCommentIdToRemove } },
//       (err, updatedComment) => {
//         if (err) {
//           console.error('Lỗi khi cập nhật comment:', err);
//         } else {
//           return res.status(200).json({ message: 'đã được cập nhật ',updatedComment });
//         }
//       }
//     );
//     Comment.updateMany(
//       { CommentChildren: childCommentIdToRemove },
//       { $pull: { CommentChildren: childCommentIdToRemove } },
//       (err, result) => {
//         if (err) {
//           return res.status(404).json({ message: 'Không tìm thấy bình luận' });
//         } else {
//           return res.status(200).json({ message: 'Bình luận đã được xóa',data=result });
//         }
//       }
//     );
//   } catch (error) {
//     return res.status(500).json({ message: 'Lỗi khi xóa bình luận', error: error });

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
