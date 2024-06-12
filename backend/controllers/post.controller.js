import User from "../models/user.model.js";
import {v2 as cloudinary} from "cloudinary";
import Post from "../models/post.model.js";

const createPost = async (req, res) => {
    try {
        const {postedBy, caption} = req.body;
        let {img} = req.body;
        if(!postedBy || !caption ){
            return res.status(400).json({ error: "You need to write something" });
        }

        const user  = await User.findById(postedBy);
        if(!user){
            return res.status(400).json({ error: "User does not exist" });
        }

        if(user._id.toString() !== req.user._id.toString()){
            return res.status(400).json({ error: "Unauthorized to create post" });
        }
        
        const maxLength = 250;
        if(caption.length>maxLength){
            return res.status(400).json({ error: "Caption should be less than 250 characters" });
        }
        if(img){
            const uploadResponse = await cloudinary.uploader.upload(img);
            img = uploadResponse.secure_url;
        }

        let newPost = new Post({
            postedBy,
            caption,
            img,
        });

        newPost = await newPost.save();
        res.status(201).json(newPost);

    } catch (err) {
        res.status(500).json({ error: err.message });
        console.log("Error in createPost ", err.message);
    }
};

const getPosts = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if(!post){
            return res.status(400).json({ error: "Post does not exist" });
        }
        res.status(200).json(post);
    } catch (err) {
        res.status(500).json({ error: err.message });
        console.log("Error in getPosts ", err.message);
    }
}

const deletePosts = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if(!post){
            return res.status(400).json({ error: "Post does not exist" });
        }   

        if(post.postedBy.toString() !== req.user._id.toString()){
            return res.status(400).json({ error: "Unauthorized to delete post" });
        }

        await Post.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Post deleted successfully" });

    } catch (err) {
        res.status(500).json({ error: err.message });
        console.log("Error in deletePosts ", err.message);
    }
}

const likeUnlikePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if(!post){
            return res.status(400).json({ error: "Post does not exist" });
        }
        const user = await User.findById(req.user._id);
        if(!user){
            return res.status(400).json({ error: "Please Login to Like the Post" });
        }
        const isLiked = post.likes.includes(req.user._id);

        if(isLiked){
            await Post.updateOne({_id: req.params.id}, {$pull: {likes: req.user._id}});
            res.status(200).json({ message: "Post unliked successfully" });
        }
        else{
            await Post.updateOne({_id: req.params.id}, {$push: {likes: req.user._id}});
            res.status(200).json({ message: "Post liked successfully" });
        }

    } catch (err) {
        res.status(500).json({ error: err.message });
        console.log("Error in likePost ", err.message);
    }
}

const commentToPost = async (req, res) => {
    try {
        const {text} = req.body;
        const {id} = req.params;  //post Id
        const userId = req.user._id;
        const userProfilePic = req.user.profilePic;
        const username = req.user.username;
        if(!text){
            return res.status(400).json({ error: "Please fill all the fields" });
        }
        const post = await Post.findById(id);
        if(!post){
            return res.status(400).json({ error: "Post does not exist" });
        }
        const newComment = {
          userId,
          text,
          userProfilePic,
          username,
        };
        post.comments.push(newComment);

        await post.save();
        res.status(200).json({ message: "Comment added successfully", post});

    } catch (err) {
        res.status(500).json({ error: err.message });
        console.log("Error in commentToPost ", err.message);
    }
}

const getFeed = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);
        if(!user){
            return res.status(400).json({ error: "User does not exist" });
        }

        const friends = user.friends;

        const feed = await Post.find({postedBy: {$in: friends}}).sort({createdAt: -1});

        res.status(200).json({message: "Feed fetched successfully", feed});

    } catch (err) {
        res.status(500).json({ error: err.message });
        console.log("Error in getFeed ", err.message); 
    }
}

const deleteComment = async (req, res) => {
    try {
        const userId = req.user._id;
        const commentId = req.params.commentId;
        const post = await Post.findOne({"comments._id": commentId});
        if(!post){
            return res.status(400).json({ error: "No such post exist" });
        }
        const comment = post.comments.find(comment => comment._id.toString() === commentId);
        if(!comment){
            return res.status(400).json({ error: "No such comment exist" });
        }
        if(comment.userId.toString() !== userId.toString()){
            return res.status(400).json({ error: "Unauthorized to delete comment" });
        }
        post.comments = await post.comments.filter(comment => comment._id.toString() !== commentId);
        await post.save();
        res.status(200).json({ message: "Comment deleted successfully", post});
        
    } catch (err) {
        res.status(500).json({ error: err.message });
        console.log("Error in deleteComment ", err.message);        
    }
}

const likeUnlikeComment = async (req, res) => {
    try {
        const userId = req.user._id;
        const commentId = req.params.commentId;
        const post = await Post.findOne({"comments._id": commentId});
        if(!post){
            return res.status(400).json({ error: "No such post exist" });
        }
        const comment = post.comments.find(comment => comment._id.toString() === commentId);
        if(!comment){
            return res.status(400).json({ error: "No such comment exist" });
        }
        const isLiked = comment.likes.includes(userId);

        if(isLiked)
        {
            await Post.updateOne({"comments._id": commentId}, {$pull: {"comments.$.likes": userId}});
            res.status(200).json({ message: "Comment unliked successfully", post});
        }
        else{
            await Post.updateOne({"comments._id": commentId}, {$push: {"comments.$.likes": userId}});
            res.status(200).json({ message: "Comment liked successfully", post});
        }
        await post.save();
    } catch (err) {
        res.status(500).json({ error: err.message });
        console.log("Error in likeUnlikeComment ", err.message);
    }
}

export {
  createPost,
  getPosts,
  deletePosts,
  likeUnlikePost,
  commentToPost,
  getFeed,
  deleteComment,
  likeUnlikeComment,
};