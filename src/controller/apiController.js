import pool from "../config/connectBD.js";


let login = async (req, res) => {
   console.log(req.body.taikhoan, req.body.matkhau)

   const user = await pool.execute('select taikhoan,matkhau from login where taikhoan=? and matkhau=?', [req.body.taikhoan, req.body.matkhau]);
   if (user[0]) {
      console.log('taikhoan tồn tại')
      return res.status(200).json({
         message: 'oki',
         data:user[0]
         

      })
   } else {
      console.log('tai khoan  khong ton tai')
      return res.status(404).json({
         message: 'connect eror'

      })
   }

}



export default {// expo để viết chạy nhìu phần tử cubgf lúc
   login
}
// module.exports={
//     getAllUser
// }