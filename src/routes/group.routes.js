import express from "express";

import authMiddleware from "../middlewares/auth.middleware.js";
import upload from "../middlewares/upload.middleware.js";
import {
  getGroupMembers,
  addGroupMember,
  removeGroupMember,
  blockGroupMember,
  unblockGroupMember,
  makeGroupAdmin,
  removeGroupAdmin,
  leaveGroup,
  updateGroup,
} from "../controllers/group.controller.js";

const router = express.Router();

router.use(authMiddleware);

// Get group members
router.get(["/v1/:groupId/members", "/:groupId/members"], getGroupMembers);

// Add user to group
router.post(["/v1/:groupId/members", "/:groupId/members"], addGroupMember);

// Remove user from group
router.delete(["/v1/:groupId/members/:userId", "/:groupId/members/:userId"], removeGroupMember);

// Block user
router.patch(["/v1/:groupId/members/:userId/block", "/:groupId/members/:userId/block"], blockGroupMember);

// Unblock user
router.patch(["/v1/:groupId/members/:userId/unblock", "/:groupId/members/:userId/unblock"], unblockGroupMember);

// Make member admin
router.patch(["/v1/:groupId/members/:userId/admin", "/:groupId/members/:userId/admin"], makeGroupAdmin);

// Remove admin permission
router.patch(["/v1/:groupId/members/:userId/remove-admin", "/:groupId/members/:userId/remove-admin"], removeGroupAdmin);

// Leave group
router.post(["/v1/:groupId/leave", "/:groupId/leave"], leaveGroup);

// Update group name/image
router.patch(["/v1/:groupId", "/:groupId"], upload.single("groupImage"), updateGroup);

export default router;
