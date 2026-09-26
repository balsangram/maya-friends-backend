import { Chat } from "../models/chat.model.js";
import { GroupMember } from "../models/groupMember.model.js";

// Find private chat
export const findPrivateChatRepository = async (
  userId,
  friendId
) => {
  return await Chat.findOne({
    type: "private",
    participants: {
      $all: [userId, friendId],
    },
    isActive: true,
  })
    .populate("lastMessage")
    .lean();
};

// Create chat
export const createChatRepository = async (chatData) => {
  return await Chat.create(chatData);
};

// Create multiple group members
export const createGroupMembersRepository = async (members) => {
  const docs = Array.isArray(members) ? members : [members];
  return await GroupMember.insertMany(docs, {
    ordered: false,
  });
};

// Find user's chats
export const findUserChatsRepository = async (userId) => {
  const privateChats = await Chat.find({
    type: "private",
    participants: userId,
    isActive: true,
  })
    .populate("lastMessage")
    .sort({ updatedAt: -1 })
    .lean();

  const groupMembers = await GroupMember.find({
    userId,
    status: "active",
  }).select("chatId");

  const groupIds = groupMembers.map((member) => member.chatId);

  const groups = await Chat.find({
    _id: { $in: groupIds },
    type: "group",
    isActive: true,
  })
    .populate("lastMessage")
    .sort({ updatedAt: -1 })
    .lean();

  return [...privateChats, ...groups].sort(
    (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
  );
};

// Find chat by ID
export const findChatByIdRepository = async (chatId) => {
  return await Chat.findById(chatId)
    .populate("lastMessage")
    .lean();
};

// Check private/group participant
export const isChatParticipantRepository = async (
  chatId,
  userId
) => {
  const chat = await Chat.findOne({
    _id: chatId,
    isActive: true,
  })
    .select("type participants")
    .lean();

  if (!chat) {
    return false;
  }

  if (chat.type === "private") {
    return chat.participants.some(
      (id) => id.toString() === userId.toString()
    );
  }

  const member = await GroupMember.findOne({
    chatId,
    userId,
    status: "active",
  });

  return !!member;
};

// Deactivate chat
export const deactivateChatRepository = async (chatId) => {
  return await Chat.findByIdAndUpdate(
    chatId,
    {
      $set: { isActive: false },
    },
    { new: true }
  );
};

// Update last message
export const updateLastMessageRepository = async (
  chatId,
  messageId
) => {
  return await Chat.findByIdAndUpdate(
    chatId,
    {
      $set: { lastMessage: messageId },
    },
    { new: true }
  );
};
