import express from "express";

import authMiddleware from "../middlewares/auth.middleware.js";

import {
  deleteMessage,
  editMessage,
  forwardMessage,
  getChatMessages,
  markMessageAsRead,
  sendMessage,
} from "../controllers/message.controller.js";
import upload from "../middlewares/upload.middleware.js";

const router = express.Router();

// Protect all message APIs
router.use(authMiddleware);

// Get messages
router.get("/chat/:chatId", getChatMessages);

// Send text/media message
router.post(
  "/",
  upload.single("file"),
  sendMessage
);
// Edit message
router.patch("/:messageId", editMessage);

// Delete message
router.delete("/:messageId", deleteMessage);

// Forward/share message
router.post("/:messageId/forward", forwardMessage);

// Mark message as read
router.patch("/:messageId/read", markMessageAsRead);

export default router;