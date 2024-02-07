import mongoose from "mongoose";
const Schema = mongoose.Schema;

const ChatRealtime = new mongoose.Schema(
  {
    members: Array,
  },
  {
    timestamps: true,
  }
);
export default mongoose.model("ChatRealtime", ChatRealtime);
