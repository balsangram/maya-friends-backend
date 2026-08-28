import {
  addFriendRepository,
  blockFriendRepository,
  displayAllFriendsRepository,
  findUserByIdRepository,
  unfriendRepository,
} from "../repositories/friends.repository.js";
import ApiError from "../utils/ApiError.js";

export const displayAllFriendsService = async (
  userId,
  search,
  blockUser,
  skip,
  limit
) => {
  const result = await displayAllFriendsRepository(
    userId,
    search,
    blockUser,
    skip,
    limit
  );

  return result;
};

export const addFriendService = async (userId, friendId) => {
  const friendUser = await findUserByIdRepository(friendId);

  if (!friendUser) {
    throw ApiError.notFound("Friend user not found");
  }

  if (userId.toString() === friendId.toString()) {
    throw ApiError.badRequest("You cannot add yourself as a friend");
  }

  const friends = await addFriendRepository(
    userId,
    friendUser._id
  );

  return friends;
};

export const unfriendService = async (userId, friendId) => {
  const result = await unfriendRepository(userId, friendId);

  if (!result) {
    throw ApiError.notFound("Friend record not found");
  }

  return result;
};

export const blockFriendService = async (userId, friendId, action) => {
  if (!["block", "unblock"].includes(action)) {
    throw ApiError.badRequest("Action must be block or unblock");
  }

  const friend = await findUserByIdRepository(friendId);

  if (!friend) {
    throw ApiError.notFound("User not found");
  }

  return await blockFriendRepository(
    userId,
    friendId,
    friend.name,
    friend.image,
    action
  );
};
