import express from "express"
import { getMessages, getUsersForSidebar, sendMessage } from "../controllers/message.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router()

router.get("/users", protectRoute,  getUsersForSidebar);
router.get("user/:userId", protectRoute, getMessages);

router.post("/send/:receiverId", protectRoute, sendMessage);

export default router