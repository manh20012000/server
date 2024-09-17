import { Timestamp } from "firebase-admin/firestore";
import mongoose from "mongoose";
const Schema = mongoose.Schema;
const Notification = new mongoose.Schema(
  {
    sendId: {
      type: mongoose.Types.ObjectId,
      ref: "user",
    },
    reciveId: {
      type: mongoose.Types.ObjectId,
      ref: "user",
    },
    idOjectModel: {
      type: mongoose.Types.ObjectId,
    },
    thumbnailObject: { type: String },
    avatarSend: {
      type: String,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    title: {
      // tiltle nội dung gữi là gì
      type: String,
    },
    messageNotifi: {
      // thông tin gữi là gì
      type: String,
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  Timestamp
);

export default mongoose.model("Notification", Notification);
