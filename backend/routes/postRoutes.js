import express from "express";
import { commentToPost, createPost, deletePosts, getPosts, likeUnlikePost } from "../controllers/post.controller.js";
import protectRoute from "../middleware/protectRoute.js";

const router = express.Router();

router.post("/create",protectRoute, createPost);
router.get("/:id", getPosts);
router.delete("/:id", protectRoute, deletePosts);
router.post("/like/:id", protectRoute, likeUnlikePost);
router.post("/comment/:id", protectRoute, commentToPost);



export default router;  