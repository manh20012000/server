import jwt from "jsonwebtoken";
import user from "../model/user.js";
import dotenv from "dotenv";
const authenTokenMiddle = async (req, res, next) => {
  try {
    const authorizationHeader = req.cookies.jwt;
    console.log(authorizationHeader);
    if (authorizationHeader) {
    }
    const token = authorizationHeader;
    if (token) res.sendStatus(401);
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
  } catch (err) {
    console.log(err, "lỗi với middlewere route ");
    return res.status(500).json({ err: "erroe" });
  }
};
export default authenTokenMiddle;
