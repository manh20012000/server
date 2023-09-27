import { Router, query } from "express";
import multer from "multer";
import pool from "../config/connectBD.js";
import path from "path";
import appRoot from "app-root-path";
import uuid from "react-uuid";
const uploadanh=Router();
const uploads = multer({ dest: 'public/uploads/' });
uploadanh.post('/uploadAnh', uploads.array('ArayImages', 12), async (req, res) => {
    console.log(JSON.stringify(req.files))
    const Image = [];
    try {
        const fileUrl = await req.files.map((file) => {
            Image.push("/uploads" + file.filename);
            console.log("trả về Image" + Image);
            return "/uploads/" + file.filename;
        }
        )
    } catch (err) {
        return res.status(500).json(err);
    }
}
)
export default uploadanh;