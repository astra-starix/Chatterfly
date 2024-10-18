import Conversation from "../models/conversation.models.js"
import Message from "../models/message.models.js"

export const sendMessage = async (req, res, next) => {
    try {
        const {message} = req.body
        const {id : receiverId} = req.params
        const senderId = req.user.id

        let conversation = await Conversation.findOne({
            participants: {$all: [senderId, receiverId]}
        })
        if(!conversation){
            conversation = await Conversation.create({
                participants: [senderId, receiverId]
            })
        }
        const newMessage = new Message({
            senderId,
            receiverId,
            message
        })
        if(newMessage){
            conversation.messages.push(newMessage._id)
        }
        await Promise.all([conversation.save(), newMessage.save()])
        res.status(201).json(newMessage)
    } catch (error) {
        next(error)
    }
}