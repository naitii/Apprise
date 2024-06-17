import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import generateTokensAndSetCookies from "../utils/helpers/generateTokensAndSetCookies.js";
import {v2 as cloudinary} from "cloudinary";
import mongoose from "mongoose";
import Notification from "../models/notification.model.js";

const getUserProfile = async (req, res) => {
    const {query} = req.params;
    try {
        let user;
        if(mongoose.Types.ObjectId.isValid(query)){
            user = await User.findById(query).select("-password");
        }
        else{
            user = await User.findOne({ username: query}).select("-password");
        }
        if(!user){
            return res.status(400).json({ error: "User does not exist" });
        }
        res.status(200).json(user);        
    } catch (err) {
        res.status(500).json({ error: err.message });
        console.log("Error in get user profile ", err.message);
    }
};


const signupUser = async (req, res) => {
    try {
        const { name, username, email, password } = req.body;

        if(!name || !username || !email || !password){
            return res.status(400).json({ error: "Please fill all fields" });
        }

        //validation
        const userExists = await User.findOne({email: email});
        const userExistsViaUsename = await User.findOne({ username: username });

        if(userExists) {
            return res.status(400).json({ error: "Email already in used.Try logging in" });
        }
        if(userExistsViaUsename) {
            return res.status(400).json({ error: "Username Taken" });
        }

        //handle password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        //new user
        const newUser = new User({
            name,
            username,
            email,
            bio: "",
            profilePic: "",
            password: hashedPassword,
        });
        await newUser.save();
        await Notification.create({
          userId: newUser._id,
          message: "Welcome to Apprise",
          link: "",
          read: false,
        }); 

        if(newUser){
            generateTokensAndSetCookies(newUser._id, res);
            res.status(201).json({
                _id: newUser._id,
                name: newUser.name,
                username: newUser.username,
                email: newUser.email,
                bio: "",
                profilePic: "",
            });
        }
        else{
            res.status(400).json({ error: "Invalid user data" });
        }

        
    } catch (err) {
        res.status(500).json({ error: err.message });
        console.log("Error in signup ", err.message);
    }
};

const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;

        //validation
        const user = await User.findOne({ username: username });
        if(!user) {
            return res.status(400).json({ error: "User does not exist" });
        }
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if(!isPasswordCorrect) {
            return res.status(400).json({ error: "Invalid credentials" });
        }
        else{
            generateTokensAndSetCookies(user._id, res);
            res.status(200).json({
                _id: user._id,
                name: user.name,
                profilePic: user.profilePic,
                bio: user.bio,
                username: user.username,
                email: user.email,
            });
        
        }
         
    }
    catch(err) {
        res.status(500).json({ error: err.message });
        console.log("Error in login ", err.message);
    }
};

const logoutUser = async (req, res) => {
    try {
        res.cookie("token","",{maxAge: 1});
        res.status(200).json("Logged out successfully");
    } catch (err) {
        res.status(500).json({ error: err.message });
        console.log("Error in logout ", err.message);
    }
}

const addRemoveFriend = async (req, res) => {
    try {
        const { id } = await req.params;
        const userToModify = await User.findById(id);
        const weAsUser = await User.findById(req.user?._id);
        
        if(!userToModify || !weAsUser){
            return res.status(400).json({ error: "User does not exist" });
        }
        
        if (id === req.user._id.toString()) {
          return res
            .status(400)
            .json({ error: "You cannot add yourself as friend" });
        }

        const isFriend = weAsUser.friends.includes(id);
        if(isFriend){
            await User.findByIdAndUpdate(req.user._id, { $pull: { friends: id } });
            await User.findByIdAndUpdate(id, { $pull: { friends: req.user._id } });
            res.status(200).json({ message: "Friend removed" });
        }
        else{
            await User.findByIdAndUpdate(req.user._id, { $push: { friends: id } });
            await User.findByIdAndUpdate(id, { $push: { friends: req.user._id } });
            await Notification.create({userId: id, message: `${weAsUser.username} added you as friend`, link: `/profile/${weAsUser.username}`, read: false});
            res.status(200).json({ message: "Friend added" });
        }

                
    } catch (err) {
        res.status(500).json({ error: err.message });
        console.log("Error in add/remove Friend ", err.message);
    }
}

const updateProfile = async (req, res) => {
    const {name, username, email, password, bio} = req.body;
    let { profilePic } = req.body;
    const userId = req.user._id; 
    
    try {
        let user = await User.findById(userId);
        if(!user){
            return res.status(400).json({ error: "User does not exist" });
        }
        
        if(req.params.id !== userId.toString()){
            return res.status(400).json({ error: "Some Error Occurred. Please try again" });
        }
        if(password){
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            user.password = hashedPassword;
        }
        if(profilePic){
            if(user.profilePic){
                await cloudinary.uploader.destroy(user.profilePic.split("/").pop().split(".")[0]); 
            }
            const uploadedRes = await cloudinary.uploader.upload(profilePic);
            profilePic = uploadedRes.secure_url;
        }
        user.name = name || user.name;
        if(username){
            const userExists = await User.findOne({ username: username });  
            if(userExists && userExists._id.toString() !== userId.toString()){
                return res.status(400).json({ error: "Username Taken" });
            }
            else{
                user.username = username || user.username;
            }
        }
        if(email){
            const userExists = await User.findOne({ email: email });
            if(userExists && userExists._id.toString() !== userId.toString()){
                return res.status(400).json({ error: "Email Taken" });
            }
            else{
                user.email = email || user.email;
            }
        }
        user.profilePic = profilePic || user.profilePic;
        user.bio = bio || user.bio;

        user = await user.save();
        user.password = undefined;
        res.status(200).json(
            user
        );

    } catch (err) {
        res.status(500).json({ error: err.message });
        console.log("Error in update profile ", err.message);
    }
}
const getSuggestedUsers = async (req, res) => {
    const {value} = await req.params;
    if(value.length==0){
        return res.status(200).json([]);
    }
    try {
         const users = await User.find({
           $or: [
             { username: { $regex: value, $options: "i" } },
             { name: { $regex: value, $options: "i" } },
           ],
         }).select("-password")
         users.sort((a,b)=>(a.friends.length>b.friends.length)?-1:1);
        res.status(200).json(users);       
    } catch (err) {
        res.status(500).json({ error: err.message });
        console.log("Error in get suggested users ", err.message);
    }
}


export {
  getSuggestedUsers,
  signupUser,
  loginUser,
  logoutUser,
  addRemoveFriend,
  updateProfile,
  getUserProfile,
};