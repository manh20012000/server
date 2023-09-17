port { Router, query } from "express";
import multer from "multer";
import pool from "../config/connectBD.js";
import path from "path";
import appRoot from 'app-root-path';
import { uuid } from "uuidv4";
const baiviet = Router();
baiviet.post('/tao_bai_viet', async function (req, res, next) { 
    const { idLogin,isText,datePost } = req.body
    const postUpLoad = await pool.execute(`insert into baiviet(status,datePost,idLogin) values(?,?,?)`, [isText, datePost, idLogin]);
    return res.status(200).json({ data: postUpLoad[0], msg: "OK", status: 200 })
})

baiviet.post('/postImage',async function (req, res, next) { 
    const { idLogin,isText,datePost } = req.body
    const postUpLoad = await pool.execute(`insert into baiviet(status,datePost,idLogin) values(?,?,?)`, [isText,datePost,idLogin]),
})
export default baiviet;