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
      $all: [
        userId,
        friendId,
      ],
    },

    isActive: true,
  })
    .populate(
      "participants",
      "name email profileImage"
    )
    .populate(
      "lastMessage"
    );
};


// Create chat
export const createChatRepository = async (
  chatData
) => {
  return await Chat.create(chatData);
};


// Create multiple group members
export const createGroupMembersRepository =
  async (members) => {
    return await GroupMember.insertMany(
      members,
      {
        ordered: false,
      }
    );
  };


// Find user's chats
export const findUserChatsRepository = async (
  userId
) => {
  // Private chats
  const privateChats = await Chat.find({
    type: "private",

    participants: userId,

    isActive: true,
  })
    .populate(
      "participants",
      "name email profileImage"
    )
    .populate(
      "lastMessage"
    )
    .sort({
      updatedAt: -1,
    });

  // Groups where user is an active member
  const groupMembers =
    await GroupMember.find({
      userId,
      status: "active",
    }).select("chatId");

  const groupIds =
    groupMembers.map(
      (member) => member.chatId
    );

  const groups = await Chat.find({
    _id: {
      $in: groupIds,
    },

    type: "group",

    isActive: true,
  })
    .populate(
      "groupAdmins",
      "name email profileImage"
    )
    .populate(
      "lastMessage"
    )
    .sort({
      updatedAt: -1,
    });

  return [
    ...privateChats,
    ...groups,
  ].sort(
    (a, b) =>
      new Date(b.updatedAt) -
      new Date(a.updatedAt)
  );
};


// Find chat by ID
export const findChatByIdRepository = async (
  chatId
) => {
  return await Chat.findById(chatId)
    .populate(
      "participants",
      "name email profileImage"
    )
    .populate(
      "groupAdmins",
      "name email profileImage"
    )
    .populate(
      "createdBy",
      "name email profileImage"
    )
    .populate(
      "lastMessage"
    );
};


// Check private/group participant
export const isChatParticipantRepository =
  async (
    chatId,
    userId
  ) => {
    const chat =
      await Chat.findOne({
        _id: chatId,
        isActive: true,
      }).select(
        "type participants"
      );

    if (!chat) {
      return false;
    }

    // Private chat
    if (chat.type === "private") {
      return chat.participants.some(
        (id) =>
          id.toString() ===
          userId.toString()
      );
    }

    // Group chat
    const member =
      await GroupMember.findOne({
        chatId,
        userId,
        status: "active",
      });

    return !!member;
  };


// Deactivate chat
export const deactivateChatRepository =
  async (chatId) => {
    return await Chat.findByIdAndUpdate(
      chatId,
      {
        $set: {
          isActive: false,
        },
      },
      {
        new: true,
      }
    );
  };

// Update last message
export const updateLastMessageRepository =
  async (chatId, messageId) => {
    return await Chat.findByIdAndUpdate(
      chatId,
      {
        $set: {
          lastMessage: messageId,
        },
      },
      {
        new: true,
      }
    );
  };