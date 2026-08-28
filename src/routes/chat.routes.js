import express from "express";

import {
  createPrivateChat,
  createGroupChat,
  getUserChats,
  getChatDetails,
  deleteChat,
} from "../controllers/chat.controller.js";

import authMiddleware from "../middlewares/auth.middleware.js";
import upload from "../middlewares/upload.middleware.js";

const router = express.Router();

router.use(authMiddleware);

// Create 1-to-1 private chat
router.post(["/v1/private", "/private"], createPrivateChat);

// Create group
router.post(["/v1/group", "/group"], upload.single("groupImage"), createGroupChat);

// Get logged-in user's chats
router.get(["/v1", "/"], getUserChats);

// Get particular chat
router.get(["/v1/:chatId", "/:chatId"], getChatDetails);

// Delete/deactivate chat
router.delete(["/v1/:chatId", "/:chatId"], deleteChat);

export default router;