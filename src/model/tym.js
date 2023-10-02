import mongoose from "mongoose";
const Schema = mongoose.Schema;
const Tym = new Schema({

  User: {
    type: mongoose.Types.ObjectId,
    ref: "user",
    required: true,
  },
  Baipost: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "baiviet",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  Soluong: {
    type: Number,
    required: true,
  },
});
export default mongoose.model("Tym", Tym);
