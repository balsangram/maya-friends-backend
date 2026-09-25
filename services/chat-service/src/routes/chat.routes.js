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
router.post("/v1/private", createPrivateChat);

// Create group
router.post("/v1/group", upload.single("groupImage"), createGroupChat);

// Get logged-in user's chats
router.get("/v1", getUserChats);

// Get particular chat
router.get("/v1/:chatId", getChatDetails);

// Delete/deactivate chat
router.delete("/v1/:chatId", deleteChat);

export default router;