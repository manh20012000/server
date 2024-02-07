import mongoose from "mongoose";

const chat = new mongoose.Schema(
    {
        messages: [
    
      {
        User: [{
            type: mongoose.Types.ObjectId,
            ref: "user",
          }],
        messager: String,
      },
    ],
    }
);
  
  export default mongoose.model('chat', chat);