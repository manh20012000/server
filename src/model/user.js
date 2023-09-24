import mongoose from 'mongoose';

const Schema = mongoose.Schema

const user = new Schema({
    Email: { type: String },
    Phone: { type: Number },
    Hoten:{ type: String },
    Birth:{ type: Date },
    Gender: { type: String },
    Taikhoan: { type: String },
    Avatar:{ type: String },
    Matkhau:{ type: String }
})
export default mongoose.model('user',user)