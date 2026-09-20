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
import { uploadToCloudinary } from "../utils/cloudinary.js";
import { enrichChatsWithUsers } from "../utils/enrichUsers.js";
import ApiError from "../utils/ApiError.js";


// Create private chat
export const createPrivateChatService = async (
  userId,
  friendId
) => {
  if (!friendId) {
    throw ApiError.badRequest("Friend userId is required");
  }

  if (!mongoose.Types.ObjectId.isValid(friendId)) {
    throw ApiError.badRequest("Invalid friend userId");
  }

  if (userId.toString() === friendId.toString()) {
    throw ApiError.badRequest("You cannot create a chat with yourself");
  }

  const existingChat =
    await findPrivateChatRepository(
      userId,
      friendId
    );

  if (existingChat) {
    return enrichChatsWithUsers(existingChat);
  }

  const chat = await createChatRepository({
    type: "private",
    participants: [userId, friendId],
    createdBy: userId,
  });

  return enrichChatsWithUsers(chat);
};


// Create group
export const createGroupChatService = async (paramsOrUserId, ...rest) => {
  let userId;
  let groupName;
  let groupImage = null;
  let memberIds = [];
  let file = null;

  if (
    typeof paramsOrUserId === "object" &&
    paramsOrUserId !== null &&
    !Array.isArray(paramsOrUserId)
  ) {
    ({
      userId,
      groupName,
      groupImage = null,
      memberIds = [],
      file = null,
    } = paramsOrUserId);
  } else {
    userId = paramsOrUserId;
    [groupName, groupImage = null, memberIds = [], file = null] = rest;
  }

  if (!groupName?.trim()) {
    throw ApiError.badRequest("Group name is required");
  }

  // Helper to normalize memberIds from various possible input formats
  const normalizeMemberIds = (ids) => {
    if (!ids) return [];
    if (Array.isArray(ids)) {
      return ids
        .map((id) =>
          typeof id === "object" && id !== null
            ? (id._id || id.id || id).toString()
            : String(id).trim()
        )
        .filter((id) => id && mongoose.Types.ObjectId.isValid(id));
    }
    if (typeof ids === "string") {
      const trimmed = ids.trim();
      if (!trimmed) return [];
      if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
        try {
          const parsed = JSON.parse(trimmed);
          if (Array.isArray(parsed)) {
            return normalizeMemberIds(parsed);
          }
        } catch {
          // fall through to comma split
        }
      }
      return trimmed
        .split(",")
        .map((id) => id.trim())
        .filter((id) => id && mongoose.Types.ObjectId.isValid(id));
    }
    return [];
  };

  const parsedMemberIds = normalizeMemberIds(memberIds);

  // Remove duplicate users
  const uniqueMemberIds = [
    ...new Set(parsedMemberIds),
  ];

  // Don't add creator twice
  const filteredMemberIds =
    uniqueMemberIds.filter(
      (id) => id !== userId.toString()
    );

  let formattedGroupImage = null;

  // If a file was uploaded, upload to Cloudinary
  if (file) {
    const uploadResult = await uploadToCloudinary(
      file,
      "joms/groups"
    );

    formattedGroupImage = {
      url: uploadResult.url,
      mediaId: uploadResult.publicId,
    };
  } else if (groupImage) {
    if (typeof groupImage === "string") {
      formattedGroupImage = {
        url: groupImage,
      };
    } else if (typeof groupImage === "object" && groupImage.url) {
      formattedGroupImage = groupImage;
    }
  }

  // Create group
  const group = await createChatRepository({
    type: "group",

    groupName: groupName.trim(),

    groupImage: formattedGroupImage,

    groupAdmins: [userId],

    createdBy: userId,
  });

  // Add creator as admin
  await createGroupMembersRepository([
    {
      chatId: group._id,
      userId,
      role: "admin",
      status: "active",
    },
  ]);

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

  return enrichChatsWithUsers(group);
};


// Get user's chats
export const getUserChatsService = async (
  userId
) => {
  const chats =
    await findUserChatsRepository(userId);

  return enrichChatsWithUsers(chats);
};


// Get chat details
export const getChatDetailsService = async (
  chatId,
  userId
) => {
  if (!mongoose.Types.ObjectId.isValid(chatId)) {
    throw ApiError.badRequest("Invalid chatId");
  }

  const chat =
    await findChatByIdRepository(chatId);

  if (!chat) {
    throw ApiError.notFound("Chat not found");
  }

  const isParticipant =
    await isChatParticipantRepository(
      chatId,
      userId
    );

  if (!isParticipant) {
    throw ApiError.forbidden(
      "You are not a member of this chat"
    );
  }

  return enrichChatsWithUsers(chat);
};


// Delete chat
export const deleteChatService = async (
  chatId,
  userId
) => {
  if (!mongoose.Types.ObjectId.isValid(chatId)) {
    throw ApiError.badRequest("Invalid chatId");
  }

  const chat =
    await findChatByIdRepository(chatId);

  if (!chat) {
    throw ApiError.notFound("Chat not found");
  }

  // Only creator can deactivate
  const creatorId =
    chat.createdBy?._id || chat.createdBy;

  if (
    creatorId.toString() !==
    userId.toString()
  ) {
    throw ApiError.forbidden(
      "You are not authorized to delete this chat"
    );
  }

  await deactivateChatRepository(chatId);

  return true;
};
