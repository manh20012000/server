// create chat
// getchatuser
// find chat
import ChatRealTime from "../model/ChatRealTime.js";

const CreateChat =async (req, res) => {
    const { firstId, senconId } = req.body;
    try {
        const chat = await ChatRealTime.findOne({
            members: { $all: [firstId, senconId] },
        
        })
        if (chat)
            return res.status(200).json(chat);
   
        const newchat = new ChatRealTime({
             members:[firstId,senconId]
        })
        const response = await newchat.save();
        res.status(200).json(response);
    } catch (err) {
        console.log(err)
        return res.status(500).json(err);
  }

};

const findUserChats = async (req, res) => {
    const {firstId,senconId} = req.params;
    try {
        
        const chats = await ChatRealTime.find({
            members:{$in:{userId}}
        })
        
        res.status(200).json(chats);
    }catch (err) {
        console.log(err)
        return res.status(500).json(err);
  }

}
const findChats = async (req, res) => {
    const { firstId, senconId } = req.params;
    try {
        
        const chat= await ChatRealTime.find({
            members: { $all: [firstId, senconId] },
        })
        
        res.status(200).json(chat);
    }catch (err) {
        console.log(err)
        return res.status(500).json(err);
  }

}

export default {
    CreateChat,
    findUserChats,
    findChats,
};