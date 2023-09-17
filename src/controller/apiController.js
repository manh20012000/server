import pool from "../config/connectBD.js";
import appRoot from 'app-root-path';
let login = async (req, res) => {
   console.log(req.body.taikhoan, req.body.matkhau)
   try {
      const user = await pool.execute('select taikhoan,matkhau from Login where taikhoan=? and matkhau=?', [req.body.taikhoan, req.body.matkhau]);
      if (user[0].length > 0) {
         console.log(user[0])
         return res.status(200).json({ data: user[0], msg: "OK", status: 200 })
      } else {
         return res.status(400).json({ msg: "Wrong username or password", status: 400 })
      }
   } catch (error) {
      console.log(error)
      return res.status(500).json('loi')
   }

}
let Sigin = async (req, res) => {
         console.log(req.body.taikhoan, req.body.matkhau, req.body.email)
   try {
    
      const user = await pool.execute('insert into Login(email,phone,hoten,birth,gender,taikhoan,avata,matkhau,) values(?,?,?,?,?,?,?,?)',
           [ req.body.email, req.body.phone, req.body.hoten,req.body.birth, req.body.gender,req.body.taikhoan, req.body.avata, req.body.matkhau]);
      return res.status(200).json({ data: user[0], msg: "OK", status: 200 })
   }
   catch (error) {
      return res.status(500).json('loi')
   }


}
export default {
   login, Sigin
}
