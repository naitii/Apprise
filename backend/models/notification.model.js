import mongoose from "mongoose";

const notiSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    link: {
        type: String,
        default: "",
    },
    read: {
        type: Boolean,
        default: false,
    }
}, { timestamps: true });

const Notification = mongoose.model("Notification", notiSchema);    

export default Notification;