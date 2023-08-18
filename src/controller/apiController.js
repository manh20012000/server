import pool from "../config/connectBD.js";


let login = async (req, res) => {
   try {
      const user = await pool.execute('select taikhoan,matkhau from login where taikhoan=? and matkhau=?', [req.body.taikhoan, req.body.matkhau]);

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
   try {
      console.log(req.body.taikhoan, req.body.matkhau, req.body.email)
      const user = await pool.execute('insert into login(taikhoan,matkhau,email) value(?,?,?)', [req.body.taikhoan, req.body.matkhau, req.body.email]);
      return res.status(200).json({ data: user[0], msg: "OK", status: 200 })
   }
   catch (error) {
      return res.status(500).json('loi')
   }


}
export default {
   login, Sigin
}
