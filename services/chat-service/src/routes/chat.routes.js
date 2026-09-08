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
router.post("/private", createPrivateChat);

// Create group
router.post("/group", upload.single("groupImage"), createGroupChat);

// Get logged-in user's chats
router.get("/", getUserChats);

// Get particular chat
router.get("/:chatId", getChatDetails);

// Delete/deactivate chat
router.delete("/:chatId", deleteChat);

export default router;