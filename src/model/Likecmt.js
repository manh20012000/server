import mongoose from "mongoose";

const Schema = mongoose.Schema;

const Likecmt = new Schema({
  User: {
    type: mongoose.Types.ObjectId,
    ref: "user",
  },
  Trangthai: {
    type: Boolean,
  },
    IdCommnent: {
        type: mongoose.Types.ObjectId,
        ref:"Comment"
},
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
export default mongoose.model("Likecmt", Likecmt);