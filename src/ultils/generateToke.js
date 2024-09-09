// import jwt from "jsonwebtoken";

// const gennerateTokenAndsetCookie = (userId) => {
//   return jwt.sign({ userId }, process.env.JWT_SECRET, {
//     expiresIn: "15d",
//   });
// };

// export default gennerateTokenAndsetCookie;
import jwt from "jsonwebtoken";
export  const gennerateTokenAndsetCookie = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "5h", // Thời hạn của token là 5 giờ
  });
  // console.log(userId, token, "kog id gennera");
  
  res.cookie("jwt", token, {
    maxAge: 5 * 60 * 60 * 1000, // Thiết lập cookie với thời gian hết hạn tương ứng với thời hạn của token (5 giờ)
    httpOnly: true, // prevet XSS attrackscreoss
    sameSite: "strict",
    secure: process.env.NODE_ENV !== "developement",
  });
  return token;
};
export const  genneratefreshTokenAndsetCookie = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "15d",
  });
  // console.log(userId, token, "kog id gennera");
  res.cookie("jwt", token, {
    maxAge: 15 * 24 * 60 * 60 * 1000, //MS
    httpOnly: true, // prevet XSS attrackscreoss
    sameSite: "strict",
    secure: process.env.NODE_ENV !== "developement",
  });
  return token;
};

