import { Router } from "express";

import protectRoute from "../middlewere/protectRoute.js";
import Notification from "../model/Notification.js";

const notifiCations = Router();
notifiCations.get("/getnotification/:id", protectRoute, async (req, res) => {
  const user = req.user;
  const id = req.params.id;
  console.log(id);
  try {
    const notification = await Notification.find({ reciveId: id }).sort({
      createdAt: -1,
    });
    console.log(notification);
    if (!notification)
      return res.status(404).json({ message: "default notification" });

    res.status(200).json({ data: notification, status: 200, message: "OK." });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server Error" });
  }
});
notifiCations.put("updateNotification/:id", protectRoute, async (req, res) => {
  try {
    const id = req.params.id; /// id của thông báo được cập nhật
    const notification = await Notification.findByIdAndUpdate(
      id,
      { isRead: true },
      { new: true }
    );
    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }
    res.status(200).json({ message: "Notification updated successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server Error" });
  }
});
notifiCations.delete(
  "deleteNotification/:id",
  protectRoute,
  async (req, res) => {
    const id = req.params.id;
    try {
      const notification = await Notification.findByIdAndDelete(id);
      if (!notification) {
        return res.status(404).json({ message: "Notification not found" });
      }
      res.status(200).json({ message: "Notification deleted successfully" });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Server Error" });
    }
  }
);
export default notifiCations;
