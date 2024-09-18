import { Router } from "express";

import protectRoute from "../middlewere/protectRoute.js";
import Notification from "../model/Notification.js";

const notifiCations = Router();
notifiCations.get("/getnotification/:id", protectRoute, async (req, res) => {
  const user = req.user;
  const iduser = req.params.id;
  const page = parseInt(req.query.page) || 1; // Số trang, mặc định là trang 1
  const limit = parseInt(req.query.limit) || 10; // Số lượng thông báo mỗi lần tải, mặc định là 10
  const skip = (page - 1) * limit;

  try {
    // Tìm các thông báo theo id người nhận, sắp xếp theo createdAt giảm dần, và giới hạn số lượng
    const notifications = await Notification.find({ reciveId: iduser })
      .sort({ createdAt: -1 }) // Sắp xếp giảm dần theo thời gian
      .skip(skip) // Bỏ qua các thông báo theo trang
      .limit(limit); // Giới hạn số lượng thông báo

    // Nếu không có thông báo nào
    if (!notifications || notifications.length === 0) {
      return res.status(404).json({ message: "No notifications found" });
    }

    // Trả về danh sách thông báo
    res.status(200).json({ data: notifications, status: 200, message: "OK." });
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
