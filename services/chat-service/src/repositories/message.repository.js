import { Message } from "../models/message.model.js";

// Create message
export const createMessageRepository = async (data) => {
  return await Message.create(data);
};

// Find message
export const findMessageByIdRepository = async (messageId) => {
  return await Message.findById(messageId)
    .populate("replyTo")
    .populate("forwardedFrom")
    .lean();
};

// Get messages
export const getChatMessagesRepository = async (
  chatId,
  page = 1,
  limit = 20
) => {
  const skip = (page - 1) * limit;

  const messages = await Message.find({
    chatId,
    isDeleted: false,
  })
    .populate("replyTo")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  return messages.reverse();
};

// Update message
export const updateMessageRepository = async (
  messageId,
  updateData
) => {
  return await Message.findByIdAndUpdate(
    messageId,
    { $set: updateData },
    { new: true }
  )
    .populate("replyTo")
    .lean();
};

// Soft delete
export const softDeleteMessageRepository = async (messageId) => {
  return await Message.findByIdAndUpdate(
    messageId,
    {
      $set: {
        isDeleted: true,
        deletedAt: new Date(),
        message: "",
        media: null,
      },
    },
    { new: true }
  ).lean();
};

// Mark read
export const markMessageReadRepository = async (
  messageId,
  userId
) => {
  return await Message.findByIdAndUpdate(
    messageId,
    {
      $addToSet: {
        readBy: userId,
      },
    },
    { new: true }
  ).lean();
};

// Bulk create
export const createManyMessagesRepository = async (messages) => {
  return await Message.insertMany(messages);
};
