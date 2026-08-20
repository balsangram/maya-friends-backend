import { addFriendRepository, blockFriendRepository, displayAllFriendsRepository, findUserByIdRepository, unfriendRepository } from "../repositories/friends.repository.js";

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

  console.log(friendUser, "friendUser");

  if (!friendUser) {
    throw new Error("Friend user not found");
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
    throw new Error("Friend record not found");
  }

  return result;
};

export const blockFriendService = async (userId, friendId, action) => {
  if (!["block", "unblock"].includes(action)) {
    throw new Error("Invalid action");
  }

  const friend = await findUserByIdRepository(friendId);

  if (!friend) {
    throw new Error("User not found");
  }

  return await blockFriendRepository(
    userId,
    friendId,
    friend.name,
    friend.image,
    action
  );
};