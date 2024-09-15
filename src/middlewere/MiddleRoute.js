import jwt from "jsonwebtoken";
import user from "../model/user.js";
import dotenv from "dotenv";
dotenv.config();
const authenTokenMiddle = async (req, res, next) => {
  try {
    const authorizationHeader = req.cookies.jwt; // gưi theo như này vẫn được nha mà bên client ko cần truyền theo headers như bên dưới
    const authHeader = req.headers["Authorization"]; // tacks  lấy key object ra để thực hiện cho việc xác thực
    const authorizationHeader2 = authHeader.split(" ")[1];
    console.log(authorizationHeader === authorizationHeader2,'két quả ');
    console.log(authorizationHeader, "kết quả sau khi ddung vơi middwave");
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
