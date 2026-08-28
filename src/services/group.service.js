import mongoose from "mongoose";

import {
  findGroupByIdRepository,
  findGroupMemberRepository,
  findGroupMembersRepository,
  createGroupMemberRepository,
  updateGroupMemberRepository,
  updateGroupRepository,
  addGroupAdminRepository,
  removeGroupAdminRepository,
} from "../repositories/group.repository.js";
import { uploadToCloudinary, deleteFromCloudinary } from "../utils/cloudinary.js";
import ApiError from "../utils/ApiError.js";


const validateObjectId = (
  id,
  fieldName
) => {
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    throw ApiError.badRequest(
      `Invalid ${fieldName}`
    );
  }
};


// Check whether user is group admin
const checkGroupAdmin = async (
  groupId,
  userId
) => {
  const member =
    await findGroupMemberRepository(
      groupId,
      userId
    );

  if (!member) {
    throw ApiError.forbidden(
      "You are not a member of this group"
    );
  }

  if (member.status !== "active") {
    throw ApiError.forbidden(
      "You are not an active member"
    );
  }

  if (member.role !== "admin") {
    throw ApiError.forbidden(
      "Only group admins can perform this action"
    );
  }

  return member;
};


// Get group members
export const getGroupMembersService =
  async (
    groupId,
    userId
  ) => {
    validateObjectId(
      groupId,
      "groupId"
    );

    validateObjectId(
      userId,
      "userId"
    );

    const group =
      await findGroupByIdRepository(
        groupId
      );

    if (!group) {
      throw ApiError.notFound(
        "Group not found"
      );
    }

    if (group.type !== "group") {
      throw ApiError.badRequest(
        "This chat is not a group"
      );
    }

    // User must be a member
    const member =
      await findGroupMemberRepository(
        groupId,
        userId
      );

    if (
      !member ||
      member.status !== "active"
    ) {
      throw ApiError.forbidden(
        "You are not a member of this group"
      );
    }

    return await findGroupMembersRepository(
      groupId
    );
  };


// Add member
export const addGroupMemberService =
  async (
    groupId,
    currentUserId,
    newUserId
  ) => {
    validateObjectId(
      groupId,
      "groupId"
    );

    validateObjectId(
      currentUserId,
      "userId"
    );

    validateObjectId(
      newUserId,
      "newUserId"
    );

    if (
      currentUserId.toString() ===
      newUserId.toString()
    ) {
      throw ApiError.badRequest(
        "You are already in the group"
      );
    }

    // Only admin can add members
    await checkGroupAdmin(
      groupId,
      currentUserId
    );

    const existingMember =
      await findGroupMemberRepository(
        groupId,
        newUserId
      );

    if (
      existingMember &&
      existingMember.status === "active"
    ) {
      throw ApiError.conflict(
        "User is already a member"
      );
    }

    // If previously removed/left/blocked,
    // reactivate the membership
    if (existingMember) {
      return await updateGroupMemberRepository(
        existingMember._id,
        {
          status: "active",
          role: "member",
          joinedAt: new Date(),
          leftAt: null,
          removedAt: null,
          blockedAt: null,
        }
      );
    }

    return await createGroupMemberRepository({
      chatId: groupId,
      userId: newUserId,
      role: "member",
      status: "active",
    });
  };


// Remove member
export const removeGroupMemberService =
  async (
    groupId,
    currentUserId,
    userId
  ) => {
    validateObjectId(
      groupId,
      "groupId"
    );

    validateObjectId(
      currentUserId,
      "userId"
    );

    validateObjectId(
      userId,
      "userId"
    );

    // Only admin
    await checkGroupAdmin(
      groupId,
      currentUserId
    );

    const member =
      await findGroupMemberRepository(
        groupId,
        userId
      );

    if (!member) {
      throw ApiError.notFound(
        "User is not a member of this group"
      );
    }

    if (member.status !== "active") {
      throw ApiError.badRequest(
        "User is not an active member"
      );
    }

    // Don't allow admin to remove himself
    if (
      currentUserId.toString() ===
      userId.toString()
    ) {
      throw ApiError.badRequest(
        "Use leave group to leave the group"
      );
    }

    return await updateGroupMemberRepository(
      member._id,
      {
        status: "removed",
        removedAt: new Date(),
      }
    );
  };


// Block member
export const blockGroupMemberService =
  async (
    groupId,
    currentUserId,
    userId
  ) => {
    validateObjectId(
      groupId,
      "groupId"
    );

    validateObjectId(
      currentUserId,
      "userId"
    );

    validateObjectId(
      userId,
      "userId"
    );

    await checkGroupAdmin(
      groupId,
      currentUserId
    );

    if (
      currentUserId.toString() ===
      userId.toString()
    ) {
      throw ApiError.badRequest(
        "You cannot block yourself"
      );
    }

    const member =
      await findGroupMemberRepository(
        groupId,
        userId
      );

    if (!member) {
      throw ApiError.notFound(
        "User is not a member of this group"
      );
    }

    if (member.status === "blocked") {
      throw ApiError.badRequest(
        "User is already blocked"
      );
    }

    return await updateGroupMemberRepository(
      member._id,
      {
        status: "blocked",
        blockedAt: new Date(),
      }
    );
  };


// Unblock member
export const unblockGroupMemberService =
  async (
    groupId,
    currentUserId,
    userId
  ) => {
    validateObjectId(
      groupId,
      "groupId"
    );

    validateObjectId(
      currentUserId,
      "userId"
    );

    validateObjectId(
      userId,
      "userId"
    );

    await checkGroupAdmin(
      groupId,
      currentUserId
    );

    const member =
      await findGroupMemberRepository(
        groupId,
        userId
      );

    if (!member) {
      throw ApiError.notFound(
        "User is not a member of this group"
      );
    }

    if (member.status !== "blocked") {
      throw ApiError.badRequest(
        "User is not blocked"
      );
    }

    return await updateGroupMemberRepository(
      member._id,
      {
        status: "active",
        blockedAt: null,
        joinedAt: new Date(),
      }
    );
  };


// Make admin
export const makeGroupAdminService =
  async (
    groupId,
    currentUserId,
    userId
  ) => {
    validateObjectId(
      groupId,
      "groupId"
    );

    validateObjectId(
      currentUserId,
      "userId"
    );

    validateObjectId(
      userId,
      "userId"
    );

    await checkGroupAdmin(
      groupId,
      currentUserId
    );

    const member =
      await findGroupMemberRepository(
        groupId,
        userId
      );

    if (!member) {
      throw ApiError.notFound(
        "User is not a member of this group"
      );
    }

    if (member.status !== "active") {
      throw ApiError.badRequest(
        "User must be an active member"
      );
    }

    if (member.role === "admin") {
      throw ApiError.badRequest(
        "User is already an admin"
      );
    }

    // Update member role
    await updateGroupMemberRepository(
      member._id,
      {
        role: "admin",
      }
    );

    // Add to Chat.groupAdmins
    return await addGroupAdminRepository(
      groupId,
      userId
    );
  };


// Remove admin
export const removeGroupAdminService =
  async (
    groupId,
    currentUserId,
    userId
  ) => {
    validateObjectId(
      groupId,
      "groupId"
    );

    validateObjectId(
      currentUserId,
      "userId"
    );

    validateObjectId(
      userId,
      "userId"
    );

    await checkGroupAdmin(
      groupId,
      currentUserId
    );

    if (
      currentUserId.toString() ===
      userId.toString()
    ) {
      throw ApiError.badRequest(
        "You cannot remove your own admin permission"
      );
    }

    const member =
      await findGroupMemberRepository(
        groupId,
        userId
      );

    if (!member) {
      throw ApiError.notFound(
        "User is not a member of this group"
      );
    }

    if (member.role !== "admin") {
      throw ApiError.badRequest(
        "User is not an admin"
      );
    }

    await updateGroupMemberRepository(
      member._id,
      {
        role: "member",
      }
    );

    return await removeGroupAdminRepository(
      groupId,
      userId
    );
  };


// Leave group
export const leaveGroupService =
  async (
    groupId,
    userId
  ) => {
    validateObjectId(
      groupId,
      "groupId"
    );

    validateObjectId(
      userId,
      "userId"
    );

    const member =
      await findGroupMemberRepository(
        groupId,
        userId
      );

    if (!member) {
      throw ApiError.notFound(
        "You are not a member of this group"
      );
    }

    if (member.status !== "active") {
      throw ApiError.badRequest(
        "You are not an active member"
      );
    }

    // If admin leaves, remove admin role
    if (member.role === "admin") {
      await removeGroupAdminRepository(
        groupId,
        userId
      );
    }

    return await updateGroupMemberRepository(
      member._id,
      {
        status: "left",
        leftAt: new Date(),
        role: "member",
      }
    );
  };


// Update group
export const updateGroupService =
  async (
    groupId,
    userId,
    updateData,
    file = null
  ) => {
    validateObjectId(
      groupId,
      "groupId"
    );

    validateObjectId(
      userId,
      "userId"
    );

    await checkGroupAdmin(
      groupId,
      userId
    );

    const existingGroup =
      await findGroupByIdRepository(groupId);

    if (!existingGroup) {
      throw ApiError.notFound("Group not found");
    }

    const updateFields = {};

    if (
      updateData.groupName !==
        undefined
    ) {
      const groupName =
        updateData.groupName.trim();

      if (!groupName) {
        throw ApiError.badRequest(
          "Group name cannot be empty"
        );
      }

      updateFields.groupName =
        groupName;
    }

    let oldGroupImagePublicId = null;

    if (file) {
      const uploadResult = await uploadToCloudinary(
        file,
        "joms/groups"
      );

      updateFields.groupImage = {
        url: uploadResult.url,
        mediaId: uploadResult.publicId,
      };

      oldGroupImagePublicId = existingGroup.groupImage?.mediaId;
    } else if (
      updateData.groupImage !==
        undefined
    ) {
      if (typeof updateData.groupImage === "string") {
        updateFields.groupImage = {
          url: updateData.groupImage,
        };
      } else {
        updateFields.groupImage =
          updateData.groupImage;
      }
    }

    if (
      Object.keys(updateFields)
        .length === 0
    ) {
      throw ApiError.badRequest(
        "No fields provided for update"
      );
    }

    const updatedGroup = await updateGroupRepository(
      groupId,
      updateFields
    );

    if (oldGroupImagePublicId) {
      await deleteFromCloudinary(oldGroupImagePublicId);
    }

    return updatedGroup;
  };
