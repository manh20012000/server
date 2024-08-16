import mongoose from "mongoose";

const converStation = new mongoose.Schema(
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
