import mongoose from "mongoose";

const Schema = mongoose.Schema;
const CommentVideoChildern = new Schema({
  _id: {
    type:String,
  },User: {
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
  soluonglike: {
    type: Number,
  },
  SoluongThich: {
    type: Number,
  },
  idParentComment: { type: String, ref: "CommnetVideo" },
  idLike: [{ type: mongoose.Types.ObjectId,  ref: "user"}],
  Timing: {
    type: Date,
    default: Date.now,
  },
});
export default mongoose.model("CommentVideoChildern", CommentVideoChildern);
