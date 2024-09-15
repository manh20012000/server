import Notification from "../model/Notification.js";
import express from "express";
import mongoose from "mongoose";
import { Router, query } from "express";
import db from "../config/MongoDb.js";
import axios from "axios";
const SendNotification = Router();

SendNotification.post("/SenNotification", async (req, res) => {
  const fcmUrl =
    "https://fcm.googleapis.com/v1/projects/myproject-b5ae1/messages:send"; // Thay thế bằng thông tin dự án của bạn

  let Notification = {
    tilte: "ruke nodejdjn",
    text: "adsd friend",
  };
  let fcm_tokens = [];
  const message = {
    notification: Notification,
    token: fcm_tokens,
};

  try {
    const response = await axios.post(fcmUrl, message, {
      headers: {
        "Content-Type": "application/json",
       ' Authorization': "Bearer ya29.ElqKBGN2Ri_Uz...HnS_uNreA", // Thay thế bằng khóa máy chủ FCM của bạn
      },
    });
    // console.log("FCM Response:", response.data);
    res.status(200).send("Notification sent successfully.");
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).send("Error sending notification.");
  }
});
export default SendNotification;