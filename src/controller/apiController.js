import pool from "../config/connectBD.js";
import appRoot from "app-root-path";
let login = async (req, res) => {
 
  try {
  
    const user = await pool.execute(
      "select * from Login where taikhoan=? and matkhau=?",
      [req.body.taikhoan, req.body.matkhau]
    );
      console.log(
    req.body.taikhoan,
    req.body.matkhau + " -->>tham so truyen vao "
  );
    // console.log("consolera user:   "+JSON.stringify(user))
    if (user[0].length > 0) {
      return res.status(200).json({ data: user[0], msg: "OK", status: 200 });
    } else if (user[0] == 0) {
      return res.status(404).json({ msg: "Tài khoản hoặc pass không chính sác", status: 404 }); 
    }
  } catch (error) {
     console.log(error);
    return res.status(500);
  }
};
let Sigin = async (req, res) => {
  console.log(req.body.taikhoan, req.body.matkhau, req.body.email);
  try {
    const user = await pool.execute(
      "insert into Login(email,phone,hoten,birth,gender,taikhoan,avata,matkhau) values(?,?,?,?,?,?,?,?)",
      [
        req.body.email,
        req.body.phone,
        req.body.hoten,
        req.body.birth,
        req.body.gender,
        req.body.taikhoan,
        req.body.avata,
        req.body.matkhau,
      ]
    );
      return res.status(200).json({ data: user[0], msg: "OK", status: 200 });
  } catch (error) {
       return res.status(500).json("loi");
  }
};
export default {
  login,
  Sigin,
};
