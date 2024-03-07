import mongoose from "mongoose";
const Schema = mongoose.Schema;
const Comment = new Schema({
  _id: {
    type: String,
  },
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
 
  idParentComment: { type: String, ref: 'Comment' },
  comments: [{ type: String, ref: 'Comment' }], // Mảng chứa các comment con
  IdBaiviet: { type: Schema.Types.ObjectId, ref: 'baiviet' },
  idLike: [{ type: Schema.Types.ObjectId, ref: 'Likecmt' }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
export default mongoose.model("Comment", Comment);
// import mongoose from "mongoose";

// const Schema = mongoose.Schema;

// const CommentSchema = new Schema({
//   _id: {
//     type: String,
//   },
//   User: {
//     type: mongoose.Types.ObjectId,
//     ref: "user",
//   },
//   Content: {
//     type: String,
//   },
//   Image: {
//     type: String,
//     required: false,
//   },
//   SoluongThich: {
//     type: Number,
//   },
//   Dinhdanh: { type: String },
//   idParentComment: { type: String, ref: 'Comment' },
//   comments: [{ type: String, ref: 'Comment' }], // Mảng chứa các comment con
//   IdBaiviet: { type: Schema.Types.ObjectId, ref: 'baiviet' },
//   idLike: [{ type: Schema.Types.ObjectId, ref: 'Likecmt' }],
//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
// });

// const CommentModel = mongoose.model("Comment", CommentSchema);

// export default CommentModel;
