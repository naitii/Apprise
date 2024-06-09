import express from "express";
import {
  commentToPost,
  createPost,
  deleteComment,
  deletePosts,
  getFeed,
  getPosts,
  likeUnlikePost,
  likeUnlikeComment,
} from "../controllers/post.controller.js";
import protectRoute from "../middleware/protectRoute.js";

const router = express.Router();

router.post("/create",protectRoute, createPost);
router.get("/feed", protectRoute, getFeed);
router.get("/:id", getPosts);
router.delete("/:id", protectRoute, deletePosts);
router.post("/like/:id", protectRoute, likeUnlikePost);
router.post("/comment/:id", protectRoute, commentToPost);
router.delete("/comment/:commentId", protectRoute, deleteComment);
router.post("/comment/like/:commentId", protectRoute, likeUnlikeComment);


export default router;  