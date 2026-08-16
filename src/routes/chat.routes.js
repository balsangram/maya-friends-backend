import express from "express";

import {
  getMessageHistory,
  sendMessage,
  editMessage,
  deleteMessage,
} from "../controllers/chat.controller.js";

const router = express.Router();

router.get("/history/:userId", getMessageHistory);

router.post("/send", sendMessage);

router.put("/edit/:messageId", editMessage);

router.delete("/delete/:messageId", deleteMessage);

export default router;