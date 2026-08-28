import mongoose from "mongoose";

import {
  createMessageRepository,
  findMessageByIdRepository,
  getChatMessagesRepository,
  updateMessageRepository,
  softDeleteMessageRepository,
  markMessageReadRepository,
} from "../repositories/message.repository.js";

import {
  findChatByIdRepository,
  isChatParticipantRepository,
  updateLastMessageRepository,
} from "../repositories/chat.repository.js";
import { getIO } from "../config/socket.js";


// ============================================
// VALIDATE MONGODB ID
// ============================================

const validateId = (id, name) => {
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    throw new Error(`Invalid ${name}`);
  }
};


// ============================================
// CHECK CHAT ACCESS
// ============================================

const validateChatAccess = async (chatId, userId) => {
  validateId(chatId, "chatId");
  validateId(userId, "userId");

  const chat = await findChatByIdRepository(chatId);

  if (!chat) {
    throw new Error("Chat not found");
  }

  if (!chat.isActive) {
    throw new Error("Chat is inactive");
  }

  const allowed = await isChatParticipantRepository(
    chatId,
    userId
  );

  if (!allowed) {
    throw new Error("You are not a member of this chat");
  }

  return chat;
};


// ============================================
// SOCKET
// ============================================

const emitToChat = (chatId, event, data) => {
  const io = getIO();

  io.to(`chat:${chatId}`).emit(event, data);
};


// ============================================
// SEND MESSAGE
// ============================================

export const sendMessageService = async (
  senderId,
  payload
) => {
  validateId(senderId, "senderId");

  const {
    chatId,
    messageType = "text",
    message = "",
    media = null,
    replyTo = null,
  } = payload;

  validateId(chatId, "chatId");

  await validateChatAccess(chatId, senderId);

  const allowedMessageTypes = [
    "text",
    "image",
    "video",
    "audio",
    "file",
  ];

  if (!allowedMessageTypes.includes(messageType)) {
    throw new Error("Invalid message type");
  }

  if (messageType === "text" && !message.trim()) {
    throw new Error("Message is required");
  }

  if (
    ["image", "video", "audio", "file"].includes(
      messageType
    ) &&
    !media?.url
  ) {
    throw new Error("Media URL is required");
  }

  // Validate reply
  if (replyTo) {
    validateId(replyTo, "replyTo");

    const replyMessage =
      await findMessageByIdRepository(replyTo);

    if (!replyMessage) {
      throw new Error("Reply message not found");
    }

    const replyChatId =
      replyMessage.chatId?._id ||
      replyMessage.chatId;

    if (
      replyChatId.toString() !==
      chatId.toString()
    ) {
      throw new Error(
        "Reply message must belong to the same chat"
      );
    }
  }

  const newMessage =
    await createMessageRepository({
      chatId,
      senderId,
      messageType,
      message:
        messageType === "text"
          ? message.trim()
          : message,
      media,
      replyTo,
      readBy: [senderId],
    });

  // Update last message
  await updateLastMessageRepository(
    chatId,
    newMessage._id
  );

  const populated =
    await findMessageByIdRepository(
      newMessage._id
    );

  if (!populated) {
    throw new Error(
      "Failed to fetch created message"
    );
  }

  // Notify chat users
  emitToChat(
    chatId,
    "new_message",
    populated
  );

  return populated;
};


// ============================================
// GET CHAT MESSAGES
// ============================================

export const getChatMessagesService = async (
  userId,
  chatId,
  page = 1,
  limit = 20
) => {
  validateId(userId, "userId");
  validateId(chatId, "chatId");

  await validateChatAccess(
    chatId,
    userId
  );

  page = Number(page);
  limit = Number(limit);

  if (page < 1) {
    page = 1;
  }

  if (limit < 1 || limit > 100) {
    limit = 20;
  }

  return await getChatMessagesRepository(
    chatId,
    page,
    limit
  );
};


// ============================================
// EDIT MESSAGE
// ============================================

export const editMessageService = async (
  userId,
  messageId,
  text
) => {
  validateId(userId, "userId");
  validateId(messageId, "messageId");

  if (!text?.trim()) {
    throw new Error(
      "Message text is required"
    );
  }

  const message =
    await findMessageByIdRepository(
      messageId
    );

  if (!message) {
    throw new Error(
      "Message not found"
    );
  }

  const senderId =
    message.senderId?._id ||
    message.senderId;

  if (
    senderId.toString() !==
    userId.toString()
  ) {
    throw new Error(
      "You can edit only your own message"
    );
  }

  if (message.isDeleted) {
    throw new Error(
      "Deleted message cannot be edited"
    );
  }

  const updated =
    await updateMessageRepository(
      messageId,
      {
        message: text.trim(),
        isEdited: true,
        editedAt: new Date(),
      }
    );

  const chatId =
    message.chatId?._id ||
    message.chatId;

  emitToChat(
    chatId,
    "message_updated",
    updated
  );

  return updated;
};


// ============================================
// DELETE MESSAGE
// ============================================

export const deleteMessageService = async (
  userId,
  messageId
) => {
  validateId(userId, "userId");
  validateId(messageId, "messageId");

  const message =
    await findMessageByIdRepository(
      messageId
    );

  if (!message) {
    throw new Error(
      "Message not found"
    );
  }

  const senderId =
    message.senderId?._id ||
    message.senderId;

  if (
    senderId.toString() !==
    userId.toString()
  ) {
    throw new Error(
      "You can delete only your own message"
    );
  }

  if (message.isDeleted) {
    throw new Error(
      "Message is already deleted"
    );
  }

  const deleted =
    await softDeleteMessageRepository(
      messageId
    );

  const chatId =
    message.chatId?._id ||
    message.chatId;

  emitToChat(
    chatId,
    "message_deleted",
    {
      messageId,
      chatId,
    }
  );

  return deleted;
};


// ============================================
// FORWARD MESSAGE
// ============================================

export const forwardMessageService = async (
  senderId,
  messageId,
  chatIds
) => {
  validateId(senderId, "senderId");
  validateId(messageId, "messageId");

  if (
    !Array.isArray(chatIds) ||
    chatIds.length === 0
  ) {
    throw new Error(
      "At least one chat is required"
    );
  }

  const original =
    await findMessageByIdRepository(
      messageId
    );

  if (!original) {
    throw new Error(
      "Original message not found"
    );
  }

  if (original.isDeleted) {
    throw new Error(
      "Deleted message cannot be forwarded"
    );
  }

  const uniqueChatIds = [
    ...new Set(
      chatIds.map((id) => id.toString())
    ),
  ];

  const forwardedMessages = [];

  for (const chatId of uniqueChatIds) {
    validateId(chatId, "chatId");

    await validateChatAccess(
      chatId,
      senderId
    );

    const created =
      await createMessageRepository({
        chatId,
        senderId,
        messageType:
          original.messageType,
        message:
          original.message || "",
        media:
          original.media || null,
        isForwarded: true,
        forwardedFrom:
          original._id,
        readBy: [senderId],
      });

    await updateLastMessageRepository(
      chatId,
      created._id
    );

    const populated =
      await findMessageByIdRepository(
        created._id
      );

    if (populated) {
      forwardedMessages.push(
        populated
      );

      emitToChat(
        chatId,
        "new_message",
        populated
      );
    }
  }

  return forwardedMessages;
};


// ============================================
// MARK MESSAGE AS READ
// ============================================

export const markMessageAsReadService = async (
  userId,
  messageId
) => {
  validateId(userId, "userId");
  validateId(messageId, "messageId");

  const message =
    await findMessageByIdRepository(
      messageId
    );

  if (!message) {
    throw new Error(
      "Message not found"
    );
  }

  const chatId =
    message.chatId?._id ||
    message.chatId;

  await validateChatAccess(
    chatId,
    userId
  );

  const updated =
    await markMessageReadRepository(
      messageId,
      userId
    );

  emitToChat(
    chatId,
    "message_read",
    {
      messageId,
      userId,
    }
  );

  return updated;
};