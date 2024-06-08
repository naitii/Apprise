import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if(!token) {
            return res.status(401).json({ error: "Unauthorized access" });
        }
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select("-password");
        req.user = await user;

        next();
        
    } catch (err) {
        res.status(500).json({ error: err.message });
        console.log("Error in protectRoute ", err.message);
    }

};
export default protectRoute;