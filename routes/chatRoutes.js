import express from "express";
import {
  createOrGetChat,
  sendMessage,
  getChatMessages,
} from "../controllers/chatController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

// Middleware to ensure user is authenticated
router.use(authenticate);

// Route to create or retrieve a chat between two users
router.post("/", createOrGetChat);

// Route to send a message in a chat
router.post("/:chatId/messages", sendMessage);

// Route to get all messages in a chat
router.get("/:chatId/messages", getChatMessages);

export default router;
