import User from "../models/user.model.js";
import Post from "../models/post.model.js";

const createPost = async (req, res) => {
    try {
        const {postedBy, caption, img} = req.body;
        if(!postedBy || !caption ){
            return res.status(400).json({ error: "Please fill all the fields" });
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
        let newPost = new Post({
            postedBy,
            caption,
            img,
        });

        newPost = await newPost.save();
        res.status(201).json({message: "Post created successfully", newPost});

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


export { createPost, getPosts, deletePosts };