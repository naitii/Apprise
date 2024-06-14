import express from "express";

import protectRoute from "../middleware/protectRoute.js";
import {
  sendMessage,
  getAllMessages,
  getConverastion,
} from "../controllers/chat.controller.js";

const router = express.Router();

router.get("/conversations", protectRoute, getConverastion);
router.post("/", protectRoute, sendMessage);
router.get("/:otherOne", protectRoute, getAllMessages)

export default router;