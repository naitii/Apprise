import { text } from "express";
import mongoose from "mongoose";

const postSchema = mongoose.Schema({
    postedBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    caption: {
        type: String,
        required: true,
        maxLength: 250,
    },
    img: {
        type: String,
    },
    likes: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: [],
    },
    comments: [{
        userId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        text:{
            type: String,
            required: true,
        },
        userProfilePic: {
            type: String,
        },
        username: {
            type: String,
            required: true,
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
    }]

}, {timestamps: true});

const Post = mongoose.model("Post", postSchema);

export default Post;