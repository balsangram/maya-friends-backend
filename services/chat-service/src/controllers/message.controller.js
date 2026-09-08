import asyncHandler from "express-async-handler";

import {
  sendMessageService,
  getChatMessagesService,
  editMessageService,
  deleteMessageService,
  forwardMessageService,
  markMessageAsReadService,
} from "../services/message.service.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";

// Send message
export const sendMessage = asyncHandler(
  async (req, res) => {
    const senderId = req.user.id;

    const {
      chatId,
      messageType,
      message,
      replyTo,
    } = req.body || {};

    let media = null;

    if (req.file) {
      const folder = req.file.mimetype.startsWith("image/")
        ? "joms/messages/images"
        : req.file.mimetype.startsWith("video/")
        ? "joms/messages/videos"
        : req.file.mimetype.startsWith("audio/")
        ? "joms/messages/audio"
        : "joms/messages/files";

      const uploaded = await uploadToCloudinary(req.file, folder);

      media = {
        url: uploaded.url,
        mediaId: uploaded.publicId,
        fileName: req.file.originalname,
        fileSize: req.file.size,
        mimeType: req.file.mimetype,
      };
    }

    const result =
      await sendMessageService(
        senderId,
        {
          chatId,
          messageType,
          message,
          media,
          replyTo,
        }
      );

    return res.status(201).json({
      success: true,
      message: "Message sent successfully",
      data: result,
    });
  }
);

// Get chat messages
export const getChatMessages = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const { chatId } = req.params;

  const {
    page = 1,
    limit = 20,
  } = req.query;

  const messages = await getChatMessagesService(
    userId,
    chatId,
    Number(page),
    Number(limit)
  );

  return res.status(200).json({
    success: true,
    message: "Messages fetched successfully",
    data: messages,
  });
});

// Edit message
export const editMessage = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const { messageId } = req.params;

  const { message } = req.body;

  const updated = await editMessageService(
    userId,
    messageId,
    message
  );

  return res.status(200).json({
    success: true,
    message: "Message updated successfully",
    data: updated,
  });
});

// Delete message
export const deleteMessage = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const { messageId } = req.params;

  const deleted = await deleteMessageService(
    userId,
    messageId
  );

  return res.status(200).json({
    success: true,
    message: "Message deleted successfully",
    data: deleted,
  });
});

// Forward message
export const forwardMessage = asyncHandler(async (req, res) => {
  const senderId = req.user.id;

  const { messageId } = req.params;

  const { chatIds } = req.body;

  const messages = await forwardMessageService(
    senderId,
    messageId,
    chatIds
  );

  return res.status(201).json({
    success: true,
    message: "Message forwarded successfully",
    data: messages,
  });
});

// Mark as read
export const markMessageAsRead = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const { messageId } = req.params;

  await markMessageAsReadService(
    userId,
    messageId
  );

  return res.status(200).json({
    success: true,
    message: "Message marked as read",
  });
});