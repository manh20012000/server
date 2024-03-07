import express from "express";
import { Router, query } from "express";
import protectRoute from "../middlewere/protectRoute.js";
import user from "../model/user.js";
import converStation from "../model/converStationModel.js";
const routerUser = Router();
routerUser.get("/UserRouter", protectRoute, async (req, res) => {
  try {
    const loggerInUserId = req.user._id; // user login
    console.log("loggerInUserId",);
    const conversations = await converStation
    .find({
      participants:loggerInUserId,
    })
    .populate({
      path: "participants",
      model: "user",
      select: "_id Email Hoten Avatar", // Loại trừ mật khẩu
      match: { _id: { $ne: loggerInUserId } },
    })
    .populate({
      path: "messages",
      model: "messageShamec",
      options: { sort: { createdAt: -1 }, limit: 1 }, // Lấy tin nhắn gần đây nhất
    });


    const filteredConversations = conversations.map((conversation) => ({
      messages: conversation.messages[0],
      participants: conversation.participants.find(
        (participant) => participant._id.toString() !== loggerInUserId
      ),
    }));
    console.log(filteredConversations);
    res.status(200).json(filteredConversations);
  } catch (error) {
    res.status(500).json({ err: " inernal server error" });
  }
});
routerUser.get("/UserSelelectchat", protectRoute, async (req, res) => {
  try {
    const loggerInUserId = req.user._id;
    const filterUser = await user
      .find({ _id: { $ne: loggerInUserId } })
      .select("_id Email Hoten Avatar ");
    console.log("ffileter");
    res.status(200).json(filterUser);
  } catch (error) {
    res.status(500).json({ err: " inernal server error" });
  }
});
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
