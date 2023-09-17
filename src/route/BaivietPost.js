import { Router } from "express";
const baiviet = Router();
baiviet.post('/tao_bai_viet', async function (req, res, next) { 

    const { ten, vanban, danhsachanh,thoigian } = req.body
    const postUpLoad = await pool.execute(`insert into baiviet(dongtrangthai,idLogin,thoigian) values(?,?,?)`, [ten, vanban, thoigian]),
    
})


export default baiviet;