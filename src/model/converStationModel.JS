import mongoose from "mongoose";
const Schema = mongoose.Schema;
const converStation = new Schema(
  {
    participants: [
      {
        type: mongoose.Types.ObjectId,
        ref: "user",
      },
    ],
    messages: [
      {
        type: mongoose.Types.ObjectId,
        ref: "messageShamec",
        default: [],
      },
    ],
  },
  {
    timestamps: true,
  }
);
export default mongoose.model("converStation", converStation);
