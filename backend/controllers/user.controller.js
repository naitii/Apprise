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
        const { email, password } = req.body;

        //validation
        const user = await User.findOne({ email: email });
        if(!user) {
            return res.status(400).json({ error: "User does not exist" });
        }
         
    }
    catch(err) {
        res.status(500).json({ error: err.message });
        console.log("Error in login ", err.message);
    }
};


export { signupUser, loginUser };