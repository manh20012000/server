import { Router } from "express";
import protectRoute from "../middlewere/protectRoute.js";
import user from "../model/user.js";
import fetch from "node-fetch"; // Ensure you have installed node-fetch
import handlerFunction from "./api_functionNotification.js";
const AddFriend = Router();

AddFriend.post("/Addfriend", protectRoute, async (req, res) => {
  const senderId = req.user._id; // ID của người gửi lời mời kết bạn
  const friendId = req.body._idfriend; // ID của người nhận lời mời kết bạn

  try {
    // Tìm người nhận lời mời kết bạn
    const friendUser = await user.findById(friendId);
    if (!friendUser) {
      return res.status(404).json({ message: "User not found" });
    }
    // thực hiện cho việc gữi thông báo 
    handlerFunction(
      friendUser.fcmToken,
      "Lời mời kết bạn",
      `${friendUser.Hoten || "Người dùng"} gửi cho bạn một lời mời kết bạn!`,
      {
        type: "friend_request",
        from: senderId,
        someData: "goes here",
      }
    );

    // Kiểm tra xem lời mời kết bạn đã tồn tại chưa
    /*Cụ thể, nó duyệt qua từng phần tử (request) trong mảng friendRequests,
     và trả về phần tử đầu tiên mà giá trị của request.from trùng khớp với senderId (ID của người gửi lời mời kết bạn). */
    const existingRequest = friendUser.friendRequests.find(
      (request) => request.from.toString() === senderId.toString()
    );

    if (existingRequest) {
      return res.status(400).json({ message: "Friend request already sent" });
    }

    // Thêm lời mời kết bạn mới vào friendRequests của người nhận
    friendUser.friendRequests.push({
      from: senderId,
      to: friendId,
      status: "pending", // Trạng thái mặc định là "pending"
    });

    // Lưu người dùng sau khi thêm lời mời kết bạn
    await friendUser.save();

    return res
      .status(200)
      .json({ message: "Friend request sent successfully" });
  } catch (error) {
    console.error("Error sending friend request:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

export default AddFriend;
// Kiểm tra nếu người dùng có Expo Push Token
// if (friendUser.fcmToken && friendUser.fcmToken.length > 0) {
//   const notifications = friendUser.fcmToken.map((itemtoken) => {
//     const message = {
//       to: itemtoken,
//       sound: "default",
//       title: "Lời mời kết bạn",
//       body: `${
//         friendUser.Hoten || "Người dùng"
//       } gửi cho bạn một lời mời kết bạn!`,
//       data: {
//         type: "friend_request",
//         from: senderId,
//         someData: "goes here",
//       },
//     };

//     // Gửi thông báo qua API của Expo
//     return fetch("https://exp.host/--/api/v2/push/send", {
//       method: "POST",
//       headers: {
//         Accept: "application/json",
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(message),
//     });
//   });

//   // Chạy tất cả các thông báo đồng thời
//   await Promise.all(notifications);
// }
