import { addFriendService, blockFriendService, displayAllFriendsService, unfriendService } from "../services/friends.service.js";
import asyncHandler from "../utils/asyncHandler.js";
import { successResponse } from "../utils/response.js";

export const displayAllFriends = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const friends = await displayAllFriendsService(userId);

  const friendData = friends.map((friend) => ({
    name: friend.name,
    image: friend.image,
  }));

  return successResponse(
    res,
    "All friends fetched successfully",
    friendData,
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
    friend,
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
    result,
    200
  );
});
export const blockFriend = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { friendId } = req.params;
  const { action } = req.body;

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
    result,
    200
  );
});