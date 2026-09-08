import { addFriendService, blockFriendService, displayAllFriendsService, unfriendService } from "../services/friends.service.js";
import asyncHandler from "../utils/asyncHandler.js";
import { getPagination, paginationResponse, successResponse } from "../utils/response.js";

export const displayAllFriends = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const {
    search = "",
    blockUser = "false",
    page = 1,
    limit = 10,
  } = req.query;

  const isBlockUser = blockUser === "true";

  const {
    page: currentPage,
    limit: pageLimit,
    skip,
  } = getPagination(page, limit);

  const result = await displayAllFriendsService(
    userId,
    search,
    isBlockUser,
    skip,
    pageLimit
  );

  const friendData = result.data.map((friend) => ({
    userId: friend.userId?._id,
    username: friend.userId?.username || null,
    image: friend.userId?.image || null,
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


export const addFriend = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { friendId } = req.body;

  const friend = await addFriendService(userId, friendId);

  return successResponse(
    res,
    "Friend added successfully",
    null,
    200
  );
});
export const unfriend = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { friendId } = req.body;

  const result = await unfriendService(userId, friendId);

  return successResponse(
    res,
    "Friend removed successfully",
    null,
    200
  );
});
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

  const result = await blockFriendService(
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
