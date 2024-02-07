import mongoose from "mongoose";
const Schema = mongoose.Schema;
const LikecmtVideo = new Schema({
  User: {
    type: mongoose.Types.ObjectId,
    ref: "user",
  },
  Trangthai: {
    type: Boolean,
  },
    IdCommnent: {
        type: mongoose.Types.ObjectId,
        ref:"CommentVideo"
},
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
export default mongoose.model("LikecmtVideo", LikecmtVideo);