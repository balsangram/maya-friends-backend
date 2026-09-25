import { Chat } from "../models/chat.model.js";
import { GroupMember } from "../models/groupMember.model.js";


// Find group
export const findGroupByIdRepository =
  async (groupId) => {
    return await Chat.findOne({
      _id: groupId,
      type: "group",
      isActive: true,
    });
  };


export const findActiveGroupMemberships = async (userId) => {
  return GroupMember.find({
    userId,
    status: "active",
  })
    .select("chatId role joinedAt")
    .lean();
};

export const findGroupsByIds = async (chatIds) => {
  return Chat.find({
    _id: { $in: chatIds },
    type: "group",
  })
    .sort({ updatedAt: -1 })
    .lean();
};

// Find one group member
export const findGroupMemberRepository =
  async (
    groupId,
    userId
  ) => {
    return await GroupMember.findOne({
      chatId: groupId,
      userId,
    });
  };


// Get all group members
export const findGroupMembersRepository =
  async (groupId) => {
    return await GroupMember.find({
      chatId: groupId,
    })
      .sort({
        createdAt: 1,
      })
      .lean();
  };


// Create group member
export const createGroupMemberRepository =
  async (memberData) => {
    return await GroupMember.create(
      memberData
    );
  };


// Update group member
export const updateGroupMemberRepository =
  async (
    memberId,
    updateData
  ) => {
    return await GroupMember.findByIdAndUpdate(
      memberId,
      {
        $set: updateData,
      },
      {
        new: true,
      }
    );
  };


// Delete group member
export const deleteGroupMemberRepository =
  async (memberId) => {
    return await GroupMember.findByIdAndDelete(
      memberId
    );
  };


// Add admin to Chat.groupAdmins
export const addGroupAdminRepository =
  async (
    groupId,
    userId
  ) => {
    return await Chat.findByIdAndUpdate(
      groupId,
      {
        $addToSet: {
          groupAdmins: userId,
        },
      },
      {
        new: true,
      }
    );
  };


// Remove admin from Chat.groupAdmins
export const removeGroupAdminRepository =
  async (
    groupId,
    userId
  ) => {
    return await Chat.findByIdAndUpdate(
      groupId,
      {
        $pull: {
          groupAdmins: userId,
        },
      },
      {
        new: true,
      }
    );
  };


// Update group
export const updateGroupRepository =
  async (
    groupId,
    updateData
  ) => {
    return await Chat.findByIdAndUpdate(
      groupId,
      {
        $set: updateData,
      },
      {
        new: true,
        runValidators: true,
      }
    ).lean();
  };