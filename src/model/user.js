import mongoose from "mongoose";

const Schema = mongoose.Schema;
const user = new Schema(
  {
    Email: { type: String },
    Phone: { type: Number },
    Hoten: { type: String },
    Birth: { type: String },
    Gender: { type: String },
    Taikhoan: { type: String },
    Avatar: { type: String },
    Matkhau: { type: String },
    userFriend: [
      {
        type: mongoose.Types.ObjectId,
        ref: "user",
      },
    ],
    AcceptFriend: [
      {
        type: mongoose.Types.ObjectId,
        ref: "user",
      },
    ],
    userFolowing: [
      {
        type: mongoose.Types.ObjectId,
        ref: "user",
      },
    ],
    numberFriend: {
      type: Number,
    },
    numberFolowing: {
      type: Number,
    },
    idVideoLike: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Video",
      },
    ],
  },
  {
    timestamps: true,
  }
);
export default mongoose.model("user", user);
