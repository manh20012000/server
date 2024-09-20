import { Router } from "express";
import protectRoute from "../middlewere/protectRoute.js";
import user from "../model/user.js";
import fetch from "node-fetch"; // Ensure you have installed node-fetch
import handlerFunction from "./api_functionNotification.js";
import Notification from "../model/Notification.js";
const AddFriend = Router();

AddFriend.post("/Addfriend", protectRoute, async (req, res) => {
  // ID của người gửi lời mời kết bạn
  const { _idsend, toreciver, status, nameSend, messagenotifi, avatarSend } =
    req.body;

  try {
    // Tìm người nhận lời mời kết bạn
    const friendReciver = await user.findById(toreciver); // người nhận
    const finduserSend = await user.findById(_idsend); // người guix
    if (!friendReciver) {
      return res.status(404).json({ message: "User not found" });
    }
    // thực hiện cho việc gữi thông báo

    // Kiểm tra xem lời mời kết bạn đã tồn tại chưa
    /*Cụ thể, nó duyệt qua từng phần tử (request) trong mảng friendRequests,
     và trả về phần tử đầu tiên mà giá trị củtrùng a request.from khớp với senderId (ID của người gửi lời mời kết bạn). */
    console.log("djjcjdsn2adsfgdxhfcjd-----------------2");
    if (status === "Respons") {
      const existingRequest = await finduserSend.friendRequests.find(
        (request) => request.to.toString() === _idsend.toString()
      );
      console.log("dhdbjdsdjsjsvDIjwdbaihcs------", existingRequest);
      if (!existingRequest)
        return res.status(404).json({ message: "Friend request not found" });
      // Tìm và cập nhật trạng thái của lời mời kết bạn thành "accepted"
      console.log("nahyvaof đây-<>>>  ", existingRequest);
      // friendReciver.friendRequests[existingRequest].status=="accepted"; bạn cũng có thể dùng như này để check  nó xem là đã được hay chua
      existingRequest.status = "Friend";
      await friendReciver.userFriends.push(_idsend);
      await finduserSend.userFriends.push(toreciver);
      finduserSend.numberFriend += 1;
      handlerFunction(
        friendReciver.fcmToken,
        "Lời mời kết bạn",
        `${finduserSend.Hoten || "Người dùng"} chấp nhận lời mời kết bạn !`,
        {
          type: "SeeDetail",
          from: _idsend,
          someData: "goes here",
        }
      );
      const notification = await new Notification({
        reciveId: toreciver,
        sendId: _idsend,
        isRead: false,
        title: "Seefriend",
        idOjectModel: _idsend,
        messageNotifi: messagenotifi,
        thumbnailObject: avatarSend, // Nếu baiViet.thumbnail là null hoặc undefined, trả về null
        avatarSend: avatarSend,
      });
      await Promise.all([
        notification.save(),
        finduserSend.save(),
        friendReciver.save(),
      ]);
      console.log("nahudbjb rgabhf công");
      return res
        .status(200)
        .json({ message: "Friend request accepted successfully" });
    } else if (status === "Friend") {
      console.log("djjcjdsn2adsfgdxhfcjgvjhv2");
      // Tìm và xóa lời mời kết bạn đã bị hủy theo index có nghĩa là
      const existingRequest = await finduserSend.friendRequests.find(
        (request) =>
          request.to.toString() === _idsend.toString() &&
          request.from.toString() === toreciver.toString()
      );
      const existingReciver = await friendReciver.friendRequests.find(
        (request) =>
          request.to.toString() === _idsend.toString() &&
          request.from.toString() === toreciver.toString()
      );
      if (existingRequest) {
        console.log("djjcjdsn22");
        finduserSend.friendRequests = finduserSend.friendRequests.filter(
          (request) =>
            request.from.toString() !== toreciver.toString() &&
            request.to.toString() !== _idsend.toString()
        );
        friendReciver.numberFriend = friendReciver.numberFriend - 1;
        finduserSend.numberFriend -= 1;
        //tiếp theo cập  nhật laị trangj thái
        // thực hiện xóa nếu như nó đã tồn tại rồi
        await friendReciver.userFriends.pull(_idsend);
        await finduserSend.userFriends.pull(toreciver);
        await Promise.all([finduserSend.save(), friendReciver.save()]);
        return res
          .status(200)
          .json({ message: "Friend request cancelled successfully" });
      } else if (existingReciver) {
        console.log("djjcjdsn233333");
        friendReciver.friendRequests = friendReciver.friendRequests.filter(
          (request) =>
            request.from.toString() !== toreciver.toString() &&
            request.to.toString() !== _idsend.toString()
        );
        friendReciver.numberFriend = friendReciver.numberFriend - 1;
        finduserSend.numberFriend -= 1;
        //tiếp theo cập  nhật laị trangj thái
        // thực hiện xóa nếu như nó đã tồn tại rồi
        await friendReciver.userFriends.pull(_idsend);
        await finduserSend.userFriends.pull(toreciver);
        await Promise.all([finduserSend.save(), friendReciver.save()]);
        return res
          .status(200)
          .json({ message: "Friend request cancelled successfully" });
      }
    }
    if (status === null) {
      handlerFunction(
        friendReciver.fcmToken,
        "Lời mời kết bạn",
        `${nameSend || "Người dùng"} gửi cho bạn một lời mời kết bạn!`,
        {
          type: "SeeDetail",
          from: _idsend,
          someData: "goes here",
        }
      );
      const notification = await new Notification({
        reciveId: toreciver,
        sendId: _idsend,
        isRead: false,
        title: "SeeUserAfriend",
        idOjectModel: _idsend,
        messageNotifi: messagenotifi,
        thumbnailObject: avatarSend, // Nếu baiViet.thumbnail là null hoặc undefined, trả về null
        avatarSend: avatarSend,
      }).save();
      // Thêm lời mời kết bạn mới vào friendRequests của người nhận
      await friendReciver.friendRequests.push({
        from: _idsend,
        to: toreciver,
        status: "Can't request",
      });
      friendReciver.numberFriend = friendReciver.numberFriend + 1;
      // Lưu người dùng sau khi thêm lời mời kết bạn
      await friendReciver.save();
      return res
        .status(200)
        .json({ message: "Friend request sent successfully" });
    } else {
      return res.status(404).json({ message: "Friend request not found" });
    }
  } catch (error) {
    console.error("Error sending friend request:", error);
    return res.status(500).json({ message: "Server error" });
  }
});
AddFriend.put("/updateFriendReq/:id", protectRoute, async (req, res) => {
  // ID của người gửi lời mời kết bạn
  const idNotification = req.params.id;
  const { sendId, reciveId, isRead, onclickchange, messagenotifi, avatarSend } =
    req.body;
  // ID của người nhận lời mời kết bạn

  try {
    // Tìm người nhận lời mời kết bạn
    const friendReciver = await user.findById(reciveId);
    const finduserSend = await user.findById(sendId);
    if (!friendReciver) {
      return res.status(401).json({ message: "User not found" });
    }
    // thực hiện cho việc gữi thông báo

    const existingRequest = friendReciver.friendRequests.find(
      (request) => request.to.toString() === sendId.toString()
      // nguow gui gioong nhai
    );

    if (existingRequest) {
      if (onclickchange === "Accept") {
        // Tìm và cập nhật trạng thái của lời mời kết bạn thành "accepted"
        // friendReciver.friendRequests[existingRequest].status=="accepted"; bạn cũng có thể dùng như này để check  nó xem là đã được hay chua
        existingRequest.status = "Accepted";
        await friendReciver.userFriends.push(sendId);

        await finduserSend.userFriends.push(reciveId);
        finduserSend.numberFriend += 1;
        handlerFunction(
          finduserSend.fcmToken,
          "Lời mời kết bạn",
          `${finduserSend.Hoten || "Người dùng"} chấp nhận lời mời kết bạn !`,
          {
            type: "SeeDetail",
            from: sendId,
            someData: "goes here",
          }
        );
        const notification = await new Notification({
          reciveId: reciveId,
          sendId: sendId,
          isRead: false,
          title: "Seefriend",
          idOjectModel: sendId,
          messageNotifi: messagenotifi,
          thumbnailObject: friendReciver.Avatar, // Nếu baiViet.thumbnail là null hoặc undefined, trả về null
          avatarSend: finduserSend.Avatar,
        });
        await Promise.all([
          notification.save(),
          finduserSend.save(),
          friendReciver.save(),
        ]);
        return res
          .status(200)
          .json({ message: "Friend request accepted successfully" });
      } else if (onclickchange === "Decline") {
        // Tìm và xóa lời mời kết bạn đã bị hủy
        friendReciver.friendRequests = friendReciver.friendRequests.filter(
          (request) => request.to.toString() !== sendId.toString()
        );
        friendReciver.numberFriend = friendReciver.numberFriend - 1;
        await friendReciver.save();
        return res
          .status(200)
          .json({ message: "Friend request cancelled successfully" });
      } else {
        return res.status(404).json({ message: "Friend request not found" });
      }
    }
    const deleteNotification = await Notification.findByIdAndDelete(
      idNotification
    );
  } catch (error) {
    console.error("Error sending friend request:", error);
    return res.status(500).json({ message: "Server error" });
  }
});
export default AddFriend;
// Kiểm tra nếu người dùng có Expo Push Token
// if (friendReciver.fcmToken && friendReciver.fcmToken.length > 0) {
//   const notifications = friendReciver.fcmToken.map((itemtoken) => {
//     const message = {
//       to: itemtoken,
//       sound: "default",
//       title: "Lời mời kết bạn",
//       body: `${
//         friendReciver.Hoten || "Người dùng"
//       } gửi cho bạn một lời mời kết bạn!`,
//       data: {
//         type: "friend_request",
//         from: senderId,
//         someData: "goes here",
//       },
//     };
// handlerFunction(
//       //   friendReciver.fcmToken,
//       //   "Lời mời kết bạn",
//       //   `${nameSend || "Người dùng"} gửi cho bạn một lời mời kết bạn!`,
//       //   {
//       //     type: "SeeDetail",
//       //     from: _idsend,
//       //     someData: "goes here",
//       //   }
//       // );
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
// const notification = await new Notification({
//   reciveId: toreciver,
//   sendId: _idsend,
//   isRead: false,
//   title: "SeeUserAfriend",
//   idOjectModel: _idsend,
//   messageNotifi: messagenotifi,
//   thumbnailObject: avatarSend, // Nếu baiViet.thumbnail là null hoặc undefined, trả về null
//   avatarSend: avatarSend,
// }).save();
// // Thêm lời mời kết bạn mới vào friendRequests của người nhận

// có thể thực hiện theo findindex
// const existingRequestIndex = friendReciver.friendRequests.findIndex(
//   (request) => request.from.toString() === _idsend.toString()
// );

// if (existingRequestIndex !== -1) {
//   // Nếu tìm thấy lời mời kết bạn, xóa phần tử tại vị trí existingRequestIndex
//   friendReciver.friendRequests.splice(existingRequestIndex, 1);

//   // Lưu lại thay đổi vào MongoDB
//   await friendReciver.save();
