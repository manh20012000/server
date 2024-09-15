import mongoose from "mongoose";
const Schema = mongoose.Schema;
const Notification = new mongoose.Schema({
  reciveId: {
    type: mongoose.Types.ObjectId,
    ref: "user",
  },
  sendId: {
    type: mongoose.Types.ObjectId,
    ref: "user",
  },

  Object_Notifi: {
    idConten: {
      type: mongoose.Schema.Types.ObjectId, // Định nghĩa kiểu ObjectId cho idConten, tham chiếu tới một tài liệu khác
      ref: "Content", // Tên model mà idConten sẽ tham chiếu đến
      required: true,
    },
    typeScreen: {
      type: String,
      required: true,
    },
  },
  refParam: {
    type: String,
  },
  isRead: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
  },
  body: {
    type: String,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Notification", Notification);
