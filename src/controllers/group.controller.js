import asyncHandler from "express-async-handler";

import {
  getGroupMembersService,
  addGroupMemberService,
  removeGroupMemberService,
  blockGroupMemberService,
  unblockGroupMemberService,
  makeGroupAdminService,
  removeGroupAdminService,
  leaveGroupService,
  updateGroupService,
} from "../services/group.service.js";


// Get group members
export const getGroupMembers = asyncHandler(
  async (req, res) => {
    const { groupId } = req.params;

    const userId = req.user.id;

    const members =
      await getGroupMembersService(
        groupId,
        userId
      );

    return res.status(200).json({
      success: true,
      message: "Group members fetched successfully",
      data: members,
    });
  }
);


// Add user to group
export const addGroupMember = asyncHandler(
  async (req, res) => {
    const { groupId } = req.params;

    const { userId } = req.body;

    const currentUserId = req.user.id;

    const member =
      await addGroupMemberService(
        groupId,
        currentUserId,
        userId
      );

    return res.status(201).json({
      success: true,
      message: "Member added successfully",
      data: member,
    });
  }
);


// Remove user from group
export const removeGroupMember =
  asyncHandler(async (req, res) => {
    const { groupId, userId } =
      req.params;

    const currentUserId = req.user.id;

    await removeGroupMemberService(
      groupId,
      currentUserId,
      userId
    );

    return res.status(200).json({
      success: true,
      message: "Member removed successfully",
    });
  });


// Block user
export const blockGroupMember =
  asyncHandler(async (req, res) => {
    const { groupId, userId } =
      req.params;

    const currentUserId = req.user.id;

    await blockGroupMemberService(
      groupId,
      currentUserId,
      userId
    );

    return res.status(200).json({
      success: true,
      message: "Member blocked successfully",
    });
  });


// Unblock user
export const unblockGroupMember =
  asyncHandler(async (req, res) => {
    const { groupId, userId } =
      req.params;

    const currentUserId = req.user.id;

    await unblockGroupMemberService(
      groupId,
      currentUserId,
      userId
    );

    return res.status(200).json({
      success: true,
      message: "Member unblocked successfully",
    });
  });


// Make member admin
export const makeGroupAdmin =
  asyncHandler(async (req, res) => {
    const { groupId, userId } =
      req.params;

    const currentUserId = req.user.id;

    await makeGroupAdminService(
      groupId,
      currentUserId,
      userId
    );

    return res.status(200).json({
      success: true,
      message: "Member is now an admin",
    });
  });


// Remove admin permission
export const removeGroupAdmin =
  asyncHandler(async (req, res) => {
    const { groupId, userId } =
      req.params;

    const currentUserId = req.user.id;

    await removeGroupAdminService(
      groupId,
      currentUserId,
      userId
    );

    return res.status(200).json({
      success: true,
      message: "Admin permission removed",
    });
  });


// Leave group
export const leaveGroup = asyncHandler(
  async (req, res) => {
    const { groupId } = req.params;

    const userId = req.user.id;

    await leaveGroupService(
      groupId,
      userId
    );

    return res.status(200).json({
      success: true,
      message: "You left the group successfully",
    });
  }
);


// Update group
export const updateGroup = asyncHandler(
  async (req, res) => {
    const { groupId } = req.params;

    const userId = req.user.id;

    const {
      groupName,
      groupImage,
    } = req.body;

    const group =
      await updateGroupService(
        groupId,
        userId,
        {
          groupName,
          groupImage,
        }
      );

    return res.status(200).json({
      success: true,
      message: "Group updated successfully",
      data: group,
    });
  }
);