import mongoose from "mongoose";
const Schema = mongoose.Schema;
const messageShamec = new Schema({
  senderId: {
    type: mongoose.Types.ObjectId,
    ref: "user",
  },
  receiverId: {
    type: mongoose.Types.ObjectId,
    ref: "user",
    require: true,
  },
  message: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
export default mongoose.model("messageShamec", messageShamec);
