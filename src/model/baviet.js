import mongoose from 'mongoose';
const Schema = mongoose.Schema
const baiviet = new Schema({
     DatePost: { type: String },
     Trangthai: { type:String },
     Pemission: { type: String },
     Fell: { type: String },
     Loaction: { type: String },
     Image: { type: Array },
     User: { type: mongoose.Types.ObjectId, ref: 'user' }
     }
     ,{
          timestamps: true
     }
     
)
export default mongoose.model('baiViet',baiviet)