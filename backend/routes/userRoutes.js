import express from "express";
import { signupUser, loginUser, logoutUser, addRemoveFriend, updateProfile, getUserProfile} from "../controllers/user.controller.js";
import protectRoute from "../middleware/protectRoute.js";

const router = express.Router();

router.get("/profile/:username", getUserProfile);
router.post("/signup", signupUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/addfriend/:id",protectRoute, addRemoveFriend);
router.put("/updateprofile/:id", protectRoute, updateProfile);

export default router;