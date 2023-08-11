import express from 'express';
import configViewEngine from './config/viewEngine.mjs';

// import connection from './config/connectBD.js';
import initAPIRoute from './route/api.js';
import cors from 'cors';
// const port = process.env.PORT||3000
const app = express();
const port = 3000
app.use(cors( { origin: 'http://localhost:3000', optionsSuccessStatus: 200 }));
app.use(express.json());
app.use(express.urlencoded({ extended: true}));

app.get("/", (req, res) => {
    res.send("server is running")
})

//config gữi đa ta client lên sever và lấy 1 cách đơ giản 

// set up view engine 
configViewEngine(app);
// innit wed router

// khoit taoj api
initAPIRoute(app);
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
