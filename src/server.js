import express from 'express';
import configViewEngine from './config/viewEngine.mjs';
import connection from './config/connectBD.js';
import initAPIRoute from './route/api_Taikhoan.js';
// import files from './controller/files.controller.js';
// import file from './controller/files.controller.js';
import cors from 'cors';
// import baiviet from './route/BaivietPost.js';
import db from './config/MongoDb.js'
// import login from './model/user.js';
import Taikhoan from './route/api_Taikhoan.js';
// const port = process.env.PORT||3000
const app = express();
const port = 8080

app.use(express.static('public'))
app.use(cors());
db.connect();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
    res.send("server is running")
})
// tao co sơ dũ liêu với login 
app.use('/',Taikhoan)
// app.use("/files", files)

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
// c2 dùng trực tiếp với này và cấu hình pack.json bỏ type modun đi 
// const express = require('express')
// const app = express()
// const port = 3000

// app.get('/', (req, res) => {
//   res.send('Hello World!')
// })

// app.listen(port, () => {
//   console.log(`Example app listening on port ${port}`)
// })
//app.post('/createLogin', async (req, res) => {
//     const { username, password, email } = req.body;
//     console.log('da vao')
//     let mylogin ={
//         username:username,
//         password: password,
//         email: email
//     }
//     await new login(mylogin).save();
//     return res.json(mylogin);
    // })
    // config gữi đa ta client lên sever và lấy 1 cách đơ giản
// app.use('/upload',file)
// gưi ảnh tư reatc native qua server
// app.use('/uploads', baiviet);

// // set up view engine 
// configViewEngine(app);
// // innit wed router

// // dung cho login và và đăng ký
// app.use(express.urlencoded({ extended: true }));
// initAPIRoute(app);

