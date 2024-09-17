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
    // MusicName: { type: String },
    positionX: { type: Number, default: null },
    positionY: { type: Number, default: null },
    width: { type: Number, default: null },
    height: { type: Number, default: null },
    inputText: { type: String },
    Pemission: { type: String },
    VideoOrImage: { type: String },
    SoluongTym: { type: Number, default: 0 },
    SoluongCmt: { type: Number, default: 0 },
    Like: [LikeVideo],
    Thumbnail: {
      type: String,
    },
    typeOr: { type: Boolean },
    resizeMode: {
      type: Boolean,
    },
  },
  {
    timestamps: true,
  }
);
export default mongoose.model("Story", Story);
