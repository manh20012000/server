import mongoose from "mongoose";
const Schema = mongoose.Schema;
const LikeVideo = new Schema({
  User: {
    type: mongoose.Types.ObjectId,
    ref: "user",
  },
  Trangthai: {
    type: Boolean,
  },
  Thumbnail: {
    type: String,
  },

  Emoj: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
const Story = new Schema(
  {
    User: { type: mongoose.Types.ObjectId, ref: "user" },
    width: { type: Number, default: null },
    height: { type: Number, default: null },
    VideoOrImage: { type: String },
    SoluongTym: { type: Number, default: 0 },
    SoluongCmt: { type: Number, default: 0 },
    Like: [LikeVideo],
    Thumbnail: {
      type: String,
    },
    resizeMode: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);
export default mongoose.model("Story", Story);
