import express from "express";
import { Router, query } from "express";
import protectRoute from "../middlewere/protectRoute.js";
import user from "../model/user.js";
import ConverStationModel from "../model/ConverStationModel.js";
import authenTokenMiddle from "../middlewere/MiddleRoute.js";
const routerUser = Router();
routerUser.get("/UserRouter/:id", protectRoute, async (req, res) => {
  try {
    const loggerInUserId = req.params.id;
    console.log(loggerInUserId, "UserRouter");
    const conversations = await ConverStationModel.find({
      participants: loggerInUserId,
    })
      .populate({
        path: "participants",
        model: "user",
        select: "_id Email Hoten Avatar",
        match: { _id: { $ne: loggerInUserId } },
      })
      .populate({
        path: "messages",
        model: "messageShamec",
        options: { sort: { createdAt: -1 }, limit: 10 },
        populate: {
          path: "senderId",
          model: "user",
        },
      });
    // .populate("friendRequests", "Hoten Avatar");
    console.log(conversations, "dhsjhj");
    const filteredConversations = ConverStationModel.map((conversation) => ({
      messages: conversation.messages.map((message) => ({
        _id: message._id,
        text: message.text,
        video: message.video,
        image: message.image,
        createdAt: message.createdAt,
        user: {
          _id: message.senderId._id,
          name: message.senderId.Hoten,
          avatar: message.senderId.Avatar,
          // Thêm các thông tin khác của user nếu cần
        },
      })),
      participants: conversation.participants.find(
        (participant) => participant._id.toString() !== loggerInUserId
      ),
    }));
    console.log(filteredConversations);
    return res.status(200).json(filteredConversations);
  } catch (error) {
    console.log(error);
    res.status(500).json({ err: " internal server error" });
  }
});

routerUser.get("/UserSelelectchat", protectRoute, async (req, res) => {
  try {
    const loggerInUserId = req.user._id;
    const filterUser = await user
      .find({ _id: { $ne: loggerInUserId } })
      .select("_id Email Hoten Avatar ");
    // console.log("ffileter");
    res.status(200).json(filterUser);
  } catch (error) {
    res.status(500).json({ err: " inernal server error" });
  }
});
routerUser.get("/userfriendReq/:id", protectRoute, async (req, res) => {
  const iduser = req.params.id;

  try {
    const finuser = await user.findById(iduser);
    if (finuser) {
      return res.status(200).json({
        data: finuser.friendRequests,
      });
    }
    return res.status(404).json({ mess: "not found" });
  } catch (err) {
    res.status(404).json({ mess: err });
  }
});
routerUser.get(
  "/getfriend/:id",
  // protectRoute,
  async (req, res) => {
    const iduser = req.params.id;
    console.log(iduser, "hajaaj");
    try {
      const finuser = await user
        .findById(iduser)
        .select("userFriends")
        .populate({
          path: "userFriends",
          select: "_id Hoten Gender Email Avatar",
        });
      // với populate không được dùng dấu - với select bên trong nha
      if (finuser) {
        return res.status(200).json({
          data: finuser,
        });
      }
      return res.status(404).json({ mess: "not found friend user" });
    } catch (err) {
      res.status(404).json({ mess: err });
    }
  }
);
export default routerUser;
/*import express from "express";
import { Router, query } from "express";
import protectRoute from "../middlewere/protectRoute.js";
import user from "../model/user.js";
const routerUser = Router();

export default routerUser;
*/

/*import express from "express";
import { Router, query } from "express";
import protectRoute from "../middlewere/protectRoute.js";
import user from "../model/user.js";
const routerUser = Router();
routerUser.get("/UserRouter", protectRoute, async (req, res) => {
    try {
    const loggerInUserId = req.user._id;
//    console.log('hhhh')
    const filterUser = await User.find({ _id: { $ne: loggerInUserId } }).select(
      "_id Email Hoten Avatar "
      );
      console.log(filterUser)
    res.status(200).json(filterUser);
  } catch (error) {
    res.status(500).json({ err: " inernal server error" });
  }
});
export default routerUser;
*/
