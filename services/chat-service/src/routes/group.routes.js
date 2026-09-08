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
router.get("/:groupId/members", getGroupMembers);

// Add user to group
router.post("/:groupId/members", addGroupMember);

// Remove user from group
router.delete( "/:groupId/members/:userId", removeGroupMember);

// Block user
router.patch("/:groupId/members/:userId/block", blockGroupMember);

// Unblock user
router.patch("/:groupId/members/:userId/unblock", unblockGroupMember);

// Make member admin
router.patch("/:groupId/members/:userId/admin", makeGroupAdmin);

// Remove admin permission
router.patch("/:groupId/members/:userId/remove-admin", removeGroupAdmin);

// Leave group
router.post("/:groupId/leave", leaveGroup);

// Update group name/image
router.patch( "/:groupId", upload.single("groupImage"), updateGroup);

export default router;
