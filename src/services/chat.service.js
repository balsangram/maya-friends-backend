import mongoose from "mongoose";

import {
  findPrivateChatRepository,
  createChatRepository,
  createGroupMembersRepository,
  findUserChatsRepository,
  findChatByIdRepository,
  isChatParticipantRepository,
  deactivateChatRepository,
} from "../repositories/chat.repository.js";


// Create private chat
export const createPrivateChatService = async (
  userId,
  friendId
) => {
  if (!friendId) {
    throw new Error("Friend userId is required");
  }

  if (!mongoose.Types.ObjectId.isValid(friendId)) {
    throw new Error("Invalid friend userId");
  }

  if (userId.toString() === friendId.toString()) {
    throw new Error("You cannot create a chat with yourself");
  }

  // Check whether chat already exists
  const existingChat =
    await findPrivateChatRepository(
      userId,
      friendId
    );

  if (existingChat) {
    return existingChat;
  }

  // Create private chat
  const chat = await createChatRepository({
    type: "private",

    participants: [
      userId,
      friendId,
    ],

    createdBy: userId,
  });

  return chat;
};


// Create group
export const createGroupChatService = async (
  userId,
  groupName,
  groupImage,
  memberIds
) => {
  if (!groupName?.trim()) {
    throw new Error("Group name is required");
  }

  // Remove duplicate users
  const uniqueMemberIds = [
    ...new Set(
      memberIds.map((id) => id.toString())
    ),
  ];

  // Don't add creator twice
  const filteredMemberIds =
    uniqueMemberIds.filter(
      (id) => id !== userId.toString()
    );

  // Create group
  const group = await createChatRepository({
    type: "group",

    groupName: groupName.trim(),

    groupImage: groupImage || null,

    groupAdmins: [userId],

    createdBy: userId,
  });

  // Add creator as admin
  await createGroupMembersRepository({
    chatId: group._id,
    userId,
    role: "admin",
    status: "active",
  });

  // Add other members
  if (filteredMemberIds.length > 0) {
    const members = filteredMemberIds.map(
      (memberId) => ({
        chatId: group._id,
        userId: memberId,
        role: "member",
        status: "active",
      })
    );

    await createGroupMembersRepository(
      members
    );
  }

  return group;
};


// Get user's chats
export const getUserChatsService = async (
  userId
) => {
  const chats =
    await findUserChatsRepository(userId);

  return chats;
};


// Get chat details
export const getChatDetailsService = async (
  chatId,
  userId
) => {
  if (!mongoose.Types.ObjectId.isValid(chatId)) {
    throw new Error("Invalid chatId");
  }

  const chat =
    await findChatByIdRepository(chatId);

  if (!chat) {
    throw new Error("Chat not found");
  }

  // Check whether user belongs to chat
  const isParticipant =
    await isChatParticipantRepository(
      chatId,
      userId
    );

  if (!isParticipant) {
    throw new Error(
      "You are not a member of this chat"
    );
  }

  return chat;
};


// Delete chat
export const deleteChatService = async (
  chatId,
  userId
) => {
  if (!mongoose.Types.ObjectId.isValid(chatId)) {
    throw new Error("Invalid chatId");
  }

  const chat =
    await findChatByIdRepository(chatId);

  if (!chat) {
    throw new Error("Chat not found");
  }

  // Only creator can deactivate group
  if (
    chat.createdBy.toString() !==
    userId.toString()
  ) {
    throw new Error(
      "You are not authorized to delete this chat"
    );
  }

  await deactivateChatRepository(chatId);

  return true;
};