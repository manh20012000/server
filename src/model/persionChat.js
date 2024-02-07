import mongoose from "mongoose";
const Schema = mongoose.Schema;
const persionChat = new Schema({
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

  createdAt: {
    type: Date,
    default: Date.now,
  },
});
export default mongoose.model("persionChat",persionChat);