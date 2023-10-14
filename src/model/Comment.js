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
  SoluongThich: {
    type: Number,
  },
  
  CommentChildren: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
  IdBaiviet: { type: Schema.Types.ObjectId, ref: 'baiviet' },
  idLike: [{ type: Schema.Types.ObjectId, ref: 'Like' }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
export default mongoose.model("Comment",Comment);