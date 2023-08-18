import { Router } from 'express'
import multer from 'multer'

const upload = multer({ dest:'uploads/'})
const files = Router()
files.post("/upload", upload.array('photos', 12), function (req, res, next) {
    const photos = req.files
    console.log(photos)
    console.log("upload thanh cong")
    return next()
  }, (req, res) => {

  })
  export default files