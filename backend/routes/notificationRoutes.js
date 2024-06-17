import express from "express";
import protectRoute from "../middleware/protectRoute.js";
import { getNotifications, markNotificationsAsRead } from "../controllers/notification.controller.js";

const router = express.Router();

router.get("/:id", protectRoute, getNotifications);
router.put("/markread/:id", protectRoute, markNotificationsAsRead);

export default router;