import mongoose from "mongoose";
const Schema = mongoose.Schema;
const CommentVideo = new Schema({
  _id: {
    type:String,
  },
  User: {
    type: mongoose.Types.ObjectId,
    ref: "user",
  },
  Content: {
    type: String,
  },
  idVideo: {
    type: mongoose.Types.ObjectId,
    ref: "Video",
  },
  trangthai: {
    type: Boolean,
  },
  soluonglike: {
    type: Number,
  },
  SoluongCommentChildrent: {
    type: Number,
    default: 0,
  },
  idLike: [{ type: mongoose.Types.ObjectId, ref: "user" }],
  Timing: {
    type: Date,
    default: Date.now,
  },
});
export default mongoose.model("CommnetVideo", CommentVideo);
