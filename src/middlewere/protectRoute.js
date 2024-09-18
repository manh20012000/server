import jwt from "jsonwebtoken";
import user from "../model/user.js";
import dotenv from "dotenv";
const protectRoute = async (req, res, next) => {
  const token = req.cookies.jwt; // req.cookies.jwt; // gưi theo như này vẫn được nha mà bên client ko cần truyền theo headers như bên dưới
  //const token = req.header('Authorization').replace('Bearer ', ''); cũng có thể lấy như này được nha
  const authHeader = req.headers["authorization"]; // tacks  lấy key object ra để thực hiện cho việc xác thực
  // const tokenAUTH = req.header("Authorization").replace("Bearer ", "");
  // console.log(token, "REP JWT", authHeader, "góídhfjsdjfibsdfjbv ", tokenAUTH);
  // console.log(authHeader, "logh ra header");
  try {
    const authorizationHeader = authHeader.replace("Bearer ", "");

    if (!authorizationHeader) {
      // console.log(token)
      return res.status(401).json({ err: "authorized no token provided" });
    }
    const decoded = jwt.verify(authorizationHeader, process.env.JWT_SECRET);
    console.log(decoded, "kết quả của decor");
    if (!decoded) {
      return res.status(404).json({ err: "authorized- invalid Token" });
    }
    // console.log(decoded);
    const users = await user.findById(decoded.userId).select("-Matkhau");
    // console.log(users, "kết quả user được tìm thấy");
    if (!users) {
      return res.status(404).json({ err: "user Notfound" });
    }
    req.user = users;
    next();
  } catch (error) {
    console.log(error, "lỗi protecdroute ");
    return res.status(500).json({ err: "erroe" });
  }
};
export default protectRoute;
