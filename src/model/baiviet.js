import mongoose from "mongoose";

const Schema = mongoose.Schema;

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
    thumbnail: { type: String },
  },
  {
    timestamps: true,
  }
);
export default mongoose.model("baiViet", baiviet);
