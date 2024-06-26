import express from "express";
import {
  signupUser,
  loginUser,
  logoutUser,
  addRemoveFriend,
  updateProfile,
  getUserProfile,
  getSuggestedUsers,
} from "../controllers/user.controller.js";
import protectRoute from "../middleware/protectRoute.js";

const router = express.Router();

router.get("/profile/:query", getUserProfile);
router.get("/suggestedUsers/:value", protectRoute, getSuggestedUsers);
router.post("/signup", signupUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/addfriend/:id",protectRoute, addRemoveFriend);
router.put("/updateprofile/:id", protectRoute, updateProfile);


export default router;