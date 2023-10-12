import mongoose from "mongoose";

const Schema = mongoose.Schema;
const binhluan = new Schema({
  User: {
    type: mongoose.Types.ObjectId,
    ref: "user",
  },
  Content: {
    type: String,
  },
  Thich: {
    type: Boolean,
  },
  SoluongThich: {
    type: Number,
  },
  CommentChildren: [
    {
      User: {
        type: mongoose.Types.ObjectId,
        ref: "user",
      },
      Content: {
        type: String,
      },
      Thich: {
        type: Boolean,
      },
      SoluongThich: {
        type: Number,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
const Like = new Schema({
  User: {
    type: mongoose.Types.ObjectId,
    ref: "user",
  },
  Trangthai: {
    type: Boolean,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});
const baiviet = new Schema(
  {
    Trangthai: { type: String },
    DatePost: { type: String },
    Pemission: { type: String },
    Fell: { type: String },
    Loaction: { type: String },
    User: { type: mongoose.Types.ObjectId, ref: "user" },
    Image: { type: Array },
    SoluongTym: { type: Number, default: 0 },
    SoluongCmt: { type: Number, default: 0 },
    Like: [Like],
    Comment: [binhluan],
  },
  {
    timestamps: true,
  }
);
export default mongoose.model("baiViet", baiviet);
