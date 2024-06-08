import express from "express";
import { createPost, deletePosts, getPosts } from "../controllers/post.controller.js";
import protectRoute from "../middleware/protectRoute.js";

const router = express.Router();

router.post("/create",protectRoute, createPost);
router.get("/:id", getPosts);
router.delete("/:id", protectRoute, deletePosts);


export default router;  