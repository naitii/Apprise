import mongoose from "mongoose";

const chatSchema = mongoose.Schema({
    convoId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Conversation",
        required: true,
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    text: {
        type: String,
        required: true,
    },
}, { timestamps: true });


const Chat = mongoose.model("chat", chatSchema);   
export default Chat;