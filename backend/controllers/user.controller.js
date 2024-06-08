import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import generateTokensAndSetCookies from "../utils/helpers/generateTokensAndSetCookies.js";

const signupUser = async (req, res) => {
    try {
        const { name, username, email, password } = req.body;

        //validation
        const userExists = await User.findOne({email: email});
        const userExistsViaUsename = await User.findOne({ username: username });

        if(userExists) {
            return res.status(400).json({ error: "User already exists" });
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
            password: hashedPassword,
        });
        await newUser.save();

        if(newUser){
            generateTokensAndSetCookies(newUser._id, res);
            res.status(201).json({
                _id: newUser._id,
                name: newUser.name,
                username: newUser.username,
                email: newUser.email,

            });
        }
        else{
            res.status(400).json({ message: "Invalid user data" });
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
        console.log("friendId", weAsUser)
        
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
            res.status(200).json({ message: "Friend added" });
        }

                
    } catch (err) {
        res.status(500).json({ error: err.message });
        console.log("Error in add/remove Friend ", err.message);
    }
}

const updateProfile = async (req, res) => {
    const {name, username, email, password, profilePic, bio} = req.body;
    const userId = req.user._id; 
    try {
        let user = await User.findById(userId);
        if(!user){
            return res.status(400).json({ error: "User does not exist" });
        }
        if(req.params.id !== userId){
            return res.status(400).json({ error: "You can only update your profile" });
        }
        if(password){
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            user.password = hashedPassword;
        }

        user.name = name || user.name;
        if(username){
            const userExists = await User.findOne({ username: username });  
            if(userExists){
                return res.status(400).json({ error: "Username Taken" });
            }
            else{
                user.username = username || user.username;
            }
        }
        if(email){
            const userExists = await User.findOne({ email: email });
            if(userExists){
                return res.status(400).json({ error: "Email Taken" });
            }
            else{
                user.email = email || user.email;
            }
        }
        user.profilePic = profilePic || user.profilePic;
        user.bio = bio || user.bio;

        user = await user.save();

        res.status(200).json({
            message: "Profile updated successfully",
            user
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
        console.log("Error in update profile ", err.message);
    }
}

export { signupUser, loginUser, logoutUser, addRemoveFriend, updateProfile };