import express from "express";
import { Router, query } from "express";
import protectRoute from "../middlewere/protectRoute.js";
import user from "../model/user.js";
const AddFriend = Router();
AddFriend.post("/Addfriend", protectRoute, async (req, res) => {
  const senderId = req.user._id;
  const idfriend = req.body._idfirend;
    console.log(idfriend,'frends');
  try {
    const result = await user.updateOne(
      { _id: senderId }, // Điều kiện tìm kiếm người dùng
      { $push: { AcceptFriend: idfriend } } // Thêm idfriend vào mảng AcceptFriend
    );
    if (result.modifiedCount > 0) {
        return res.status(200).json({ message: "AcceptFriend updated successfully" });
    } else {
        return res.status(400).json({ message: "Failed to update AcceptFriend" });
    }
  } catch (err) {
    console.log(err, "loi với addfiend ");
    return res.status(500).json({ mes: "lỗi add frind" + err });
  }
});
export default AddFriend;
