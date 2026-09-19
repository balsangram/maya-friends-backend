import {
  addFriendService,
  blockFriendService,
  displayAllFriendsService,
  unfriendService,
} from "../services/friends.service.js";

import asyncHandler from "../utils/asyncHandler.js";

import {
  getPagination,
  paginationResponse,
  successResponse,
} from "../utils/response.js";


// ===============================
// Display Friends / Blocked Users
// ===============================
export const displayAllFriends = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const {
    search = "",
    blockUser = "false",
    page = 1,
    limit = 10,
  } = req.query;

  // ?blockUser=true → only blocked users
  // ?blockUser=false or omitted → only friends
  const isBlockUser = ["true", "1", "yes"].includes(
    String(blockUser).toLowerCase()
  );

  const {
    page: currentPage,
    limit: pageLimit,
    skip,
  } = getPagination(page, limit);

  const result = await displayAllFriendsService(
    userId,
    search.trim(),
    isBlockUser,
    skip,
    pageLimit
  );

  const friendData = result.data.map((friend) => ({
    userId: friend.userId,
    username: friend.username || null,
    name: friend.name || null,
    image: friend.image || null,
    type: friend.type,
  }));

  return paginationResponse(
    res,
    isBlockUser
      ? "Blocked users fetched successfully"
      : "Friends fetched successfully",
    friendData,
    currentPage,
    pageLimit,
    result.total,
    200
  );
});


// ===============================
// Add Friend
// ===============================
export const addFriend = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { friendId } = req.body;

  await addFriendService(userId, friendId);

  return successResponse(
    res,
    "Friend added successfully",
    null,
    200
  );
});


// ===============================
// Unfriend
// ===============================
export const unfriend = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { friendId } = req.body;

  await unfriendService(userId, friendId);

  return successResponse(
    res,
    "Friend removed successfully",
    null,
    200
  );
});


// ===============================
// Block / Unblock Friend
// ===============================
export const blockFriend = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { friendId } = req.params;
  const { action } = req.body;

  if (!["block", "unblock"].includes(action)) {
    return res.status(400).json({
      success: false,
      message: "Action must be block or unblock",
    });
  }

  await blockFriendService(
    userId,
    friendId,
    action
  );

  return successResponse(
    res,
    action === "block"
      ? "Friend blocked successfully"
      : "Friend unblocked successfully",
    null,
    200
  );
});