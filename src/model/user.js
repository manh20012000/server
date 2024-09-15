import mongoose from "mongoose";

const Schema = mongoose.Schema;

// Schema cho lời mời kết bạn
const FriendRequestSchema = new Schema({
  from: {
    type: mongoose.Types.ObjectId,
    ref: "user",
    required: true,
  },
  to: {
    type: mongoose.Types.ObjectId,
    ref: "user",
    required: true,
  },
  
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected"],
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Schema cho người dùng
const UserSchema = new Schema(
  {
    Email: { type: String },
    Phone: { type: Number },
    Hoten: { type: String },
    Birth: { type: String },
    Gender: { type: String },
    Taikhoan: { type: String },
    Avatar: { type: String },
    Matkhau: { type: String },
    fcmToken: [{ type: String }],
    userFriends: [
      {
        type: mongoose.Types.ObjectId,
        ref: "user",
      },
    ],
    friendRequests: [FriendRequestSchema], // Sử dụng schema lời mời kết bạn
    userFollowing: [
      {
        type: mongoose.Types.ObjectId,
        ref: "user",
      },
    ],
    numberFriend: {
      type: Number,
      default: 0,
    },
    numberFollowing: {
      type: Number,
      default: 0,
    },
    idVideoLike: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Video",
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("user", UserSchema);
// import mongoose from "mongoose";

// const Schema = mongoose.Schema;
// const user = new Schema(
//   {
//     Email: { type: String },
//     Phone: { type: Number },
//     Hoten: { type: String },
//     Birth: { type: String },
//     Gender: { type: String },
//     Taikhoan: { type: String },
//     Avatar: { type: String },
//     Matkhau: { type: String },
//     fcmToken: [{ type: String }],
//     userFriend: [
//       {
//         type: mongoose.Types.ObjectId,
//         ref: "user",
//       },
//     ],
//     AcceptFriend: [
//       {
//         type: mongoose.Types.ObjectId,
//         ref: "user",
//         stausAfriend: { type: Boolean }
//       },

//     ],
//     userFolowing: [
//       {
//         type: mongoose.Types.ObjectId,
//         ref: "user",
//       },
//     ],
//     numberFriend: {
//       type: Number,
//     },
//     numberFolowing: {
//       type: Number,
//     },
//     idVideoLike: [
//       {
//         type: mongoose.Types.ObjectId,
//         ref: "Video",
//       },
//     ],
//   },
//   {
//     timestamps: true,
//   }
// );
// export default mongoose.model("user", user);
