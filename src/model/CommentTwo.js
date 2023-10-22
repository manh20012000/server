import mongoose from "mongoose";

const Schema = mongoose.Schema;
const CommentTwo = new Schema({
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
  
    CommentChildren: [
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
          
          CommentChildren: [],
          IdBaiviet: { type: Schema.Types.ObjectId, ref: 'baiviet' },
          idLike: [{ type: Schema.Types.ObjectId, ref: 'Like' }],
          createdAt: {
            type: Date,
            default: Date.now,
          },
   ],
  IdBaiviet: { type: Schema.Types.ObjectId, ref: 'baiviet' },
  idLike: [{ type: Schema.Types.ObjectId, ref: 'Like' }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
export default mongoose.model("CommentTwo",CommentTwo);