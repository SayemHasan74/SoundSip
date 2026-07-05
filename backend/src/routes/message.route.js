import { Router } from "express";
import { sendMessage, getMessages, deleteMessage } from "../controller/message.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = Router();

router.use(protectRoute);

router.post("/", sendMessage);
router.get("/:userId", getMessages);
router.delete("/:messageId", deleteMessage);

export default router;
