import mongoose from "mongoose";
const Schema = mongoose.Schema;
const LikeVideo = new Schema({
  User: {
    type: mongoose.Types.ObjectId,
    ref: "user",
  },
  Trangthai: {
    type: Boolean,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});
const Video = new Schema(
  {
    User: { type: mongoose.Types.ObjectId, ref: "user" },
    DatePost: { type: String },
    VideoConten: { type: String },
    MusicName: { type: String },
    width: { type: Number,default:null},
    height: { type: Number,default:null},
    Pemission: { type: String },
    Loaction: { type: String },  
    Video: { type: String },
    Thumbnail: {
      type:String
    },
    SoluongTym: { type: Number, default: 0 },
    SoluongCmt: { type: Number, default: 0 },
    Like: [LikeVideo],
    resizeMode: {
      type:Boolean,
    }
  },
  {
    timestamps: true,
  }
);
export default mongoose.model("Video", Video);
