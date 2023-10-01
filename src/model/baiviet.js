import mongoose from 'mongoose';
const Schema = mongoose.Schema

const baiviet = new Schema({
     Trangthai: { type: String },
     DatePost: { type: String },
     Pemission: { type: String },
     Fell: { type: String },
     Loaction: { type: String },
     User: { type: mongoose.Types.ObjectId, ref: 'user' },
     Image: { type: Array }
     }
     ,{
          timestamps: true
     }
     
)
export default mongoose.model('baiViet',baiviet)