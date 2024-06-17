import Chat from "../models/chat.model.js";
import Conversation from "../models/conversation.model.js";
import {v2 as cloudinary} from "cloudinary";
import { getReceiverSocket, io } from "../socket/socket.js";

const sendMessage = async (req, res) => {
    try {
        const {receiverId, message} = req.body;
        let {img} = req.body;
        const senderId = req.user._id;  
        if(!receiverId){
            return res.status(400).json({ error: "Reciever not found" });
        }
        if(!img && !message) {
            return res.status(400).json({ error: "Please enter all fields" });
        }
        if(senderId === receiverId) {
            return res.status(400).json({ error: "You cannot send message to yourself" });
        }

        


        let convo = await Conversation.findOne({
            members: { $all: [senderId, receiverId] },
        });
        if(!convo) {
            convo = new Conversation({
                members: [senderId, receiverId],
                lastMessage: {
                    text: message,
                    sender: senderId,
                }
            });
            await convo.save();
        }

        if (img) {
          const res = await cloudinary.uploader.upload(img);
          img = res.secure_url;
        }

            const newChat = new Chat({
                convoId: convo._id,
                sender: senderId,
                img: img || "",
                text: message,
            });
            const chat = await newChat.save();
            const receiverSocketId = getReceiverSocket(receiverId);
            if (io.sockets.sockets.has(receiverSocketId)) {
                io.to(receiverSocketId).emit("newChat", chat);
            }
            
            await Conversation.findByIdAndUpdate(convo._id, {
                lastMessage: {
                    text: message,
                    sender: senderId,
                },
            });

        
        res.status(200).json(newChat);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getAllMessages = async (req, res) => {
    try {
        const {otherOne} = req.params;
        const userId = req.user._id;

        if(!otherOne) {
            return res.status(400).json({ error: "The other user not found" });
        }
        const convo = await Conversation.findOne({members: { $all: [userId, otherOne] }});

        if(!convo) {
            return res.status(400).json({ error: "No messages found" });
        }
        const allMessages = await Chat.find({convoId: convo._id});
        res.status(200).json(allMessages);
        
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
    
};

const getConverastion = async (req, res) => {
    try {
        const userId = req.user._id;

        const convos = await Conversation.find({members: userId}).sort({updatedAt: -1});     
        res.status(200).json(convos);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

export { sendMessage, getAllMessages, getConverastion };