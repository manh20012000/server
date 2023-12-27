import mongoose from "mongoose";

const Schema = mongoose.Schema;
const Comment = new Schema({
  User: {
    type: mongoose.Types.ObjectId,
    ref: "user",
  },
  Content: {
    type: String,
  },
  Image: {
    type: String,
    required: false,
  },
  SoluongThich: {
    type: Number,
  },
  Dinhdanh: { type: String },
  idParentComment: { type: Schema.Types.ObjectId, ref: 'Comment' },
  CommentChildren: [{ type: Schema.Types.ObjectId, ref: 'Comment',default:null}],
  IdBaiviet: { type: Schema.Types.ObjectId, ref: 'baiviet' },
  idLike: [{ type: Schema.Types.ObjectId, ref: 'Like' }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
export default mongoose.model("Comment",Comment);