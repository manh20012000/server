import pool from "../config/connectBD.js";


let login = async (req, res) => {
   try {
      const user = await pool.execute('select taikhoan,matkhau from login where taikhoan=? and matkhau=?', [req.body.taikhoan, req.body.matkhau]);
      console.log(user)
      if (user[0]) {
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
   const user = await pool.execute('insert into login(taikhoan,matkhau,email) value(?,?,?)', [req.body.taikhoan, req.body.matkhau, req.body.email]);
   if (user[0]) {
      console.log('insert thanh cong')
      return res.status(200).json({
         message: 'oki',
         data: user[0]
      })
   } else {
      console.log('tai khoan  khong ton tai')
      return res.status(404).json({
         message: 'connect eror'

      })
   }

}
export default {
   login, Sigin
}
