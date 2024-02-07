import mongoose from "mongoose";
const Schema = mongoose.Schema;
const Notification = new mongoose.Schema(
    
    
      {
        User: {
            type: mongoose.Types.ObjectId,
            ref: "user",
        },
          
        Conten: {
            type: String,
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
        dinhdang: {
            type:String,
        }
      }
);
  
  export default mongoose.model('Notification', Notification);