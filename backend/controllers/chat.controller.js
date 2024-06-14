import Chat from "../models/chat.model.js";
import Conversation from "../models/conversation.model.js";

const sendMessage = async (req, res) => {
    try {
        const {receiverId, message} = req.body;
        const senderId = req.user._id;  
        if(!receiverId || !message) {
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
            const newChat = new Chat({
                convoId: convo._id,
                sender: senderId,
                text: message,
            });
            await newChat.save();
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

        const convos = await Conversation.find({members: userId});     
        res.status(200).json(convos);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

export { sendMessage, getAllMessages, getConverastion };