import jwt from "jsonwebtoken";
import user from "../model/user.js";
import dotenv from "dotenv";
const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return res.status(401).json({ err: "authorized no token provided" });
    }
    // console.log(token, "token");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(404).json({ err: "authorized- invalid Token" });
    }
    const users = await user.findById(decoded.userId).select("-Matkhau");
    if (!users) {
      return res.status(404).json({ err: "user Notfound" });
    }
    req.user = users;

    next();
  } catch (error) {
    console.log(error, "loio ");
    return res.status(500).json({ err: "erroe" });
  }
};
export default protectRoute;
