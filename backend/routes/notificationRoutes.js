import express from "express";
import protectRoute from "../middleware/protectRoute.js";
import { getNotifications } from "../controllers/notification.controller.js";

const router = express.Router();

router.get("/:id", protectRoute, getNotifications);

export default router;