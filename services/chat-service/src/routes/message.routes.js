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
router.get("/v1/chat/:chatId", getChatMessages);

// Send text/media message
router.post(
  "/v1",
  upload.single("file"),
  sendMessage
);
// Edit message
router.patch("/v1/:messageId", editMessage);

// Delete message
router.delete("/v1/:messageId", deleteMessage);

// Forward/share message
router.post("/v1/:messageId/forward", forwardMessage);

// Mark message as read
router.patch("/v1/:messageId/read", markMessageAsRead);

export default router;