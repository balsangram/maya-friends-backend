import {
  getUserById,
  getUsersByIds,
} from "../clients/user.client.js";
import {
  addFriendRepository,
  blockFriendRepository,
  displayAllFriendsRepository,
  unfriendRepository,
} from "../repositories/friends.repository.js";
import ApiError from "../utils/ApiError.js";


// ========================================
// Display Friends / Blocked Friends
// ========================================
export const displayAllFriendsService = async (
  userId,
  search = "",
  blockUser = false,
  skip = 0,
  limit = 10
) => {
  const result = await displayAllFriendsRepository(
    userId,
    blockUser,
    0,
    Number.MAX_SAFE_INTEGER
  );

  if (!result.data.length) {
    return {
      data: [],
      total: 0,
    };
  }

  // Get all user IDs from Friends DB
  const userIds = result.data.map(
    (friend) => friend.userId.toString()
  );

  // Get user information from Auth/User Service
  const users = await getUsersByIds(userIds);

  const userMap = new Map(
    users.map((user) => [
      user._id.toString(),
      user,
    ])
  );

  // Combine friend relationship + user information
  let friends = result.data
    .map((friend) => {
      const user = userMap.get(
        friend.userId.toString()
      );

      // User no longer exists in Auth/User Service
      if (!user) {
        return null;
      }

      return {
        userId: user._id,
        username: user.username || null,
        name: user.name || user.username || null,
        image: user.image || user.profileImage || null,
        type: friend.type,
      };
    })
    .filter(Boolean);

  // Search by username or name
  if (search?.trim()) {
    const searchText = search.trim().toLowerCase();

    friends = friends.filter((friend) => {
      const username =
        friend.username?.toLowerCase() || "";

      const name =
        friend.name?.toLowerCase() || "";

      return (
        username.includes(searchText) ||
        name.includes(searchText)
      );
    });
  }

  // Total after search
  const total = friends.length;

  // Pagination
  const paginatedFriends = friends.slice(
    Number(skip),
    Number(skip) + Number(limit)
  );

  return {
    data: paginatedFriends,
    total,
  };
};


// ========================================
// Add Friend
// ========================================
export const addFriendService = async (
  userId,
  friendId
) => {
  if (!friendId) {
    throw ApiError.badRequest(
      "Friend ID is required"
    );
  }

  // Prevent adding yourself
  if (userId.toString() === friendId.toString()) {
    throw ApiError.badRequest(
      "You cannot add yourself as a friend"
    );
  }

  // Verify user exists in Auth/User Service
  const friendUser = await getUserById(friendId);

  if (!friendUser) {
    throw ApiError.notFound(
      "Friend user not found"
    );
  }

  // Add friend
  return await addFriendRepository(
    userId,
    friendId
  );
};


// ========================================
// Unfriend
// ========================================
export const unfriendService = async (
  userId,
  friendId
) => {
  if (!friendId) {
    throw ApiError.badRequest(
      "Friend ID is required"
    );
  }

  if (userId.toString() === friendId.toString()) {
    throw ApiError.badRequest(
      "Invalid friend ID"
    );
  }

  const result = await unfriendRepository(
    userId,
    friendId
  );

  if (!result) {
    throw ApiError.notFound(
      "Friend record not found"
    );
  }

  return result;
};


// ========================================
// Block / Unblock Friend
// ========================================
export const blockFriendService = async (
  userId,
  friendId,
  action
) => {
  if (!friendId) {
    throw ApiError.badRequest(
      "Friend ID is required"
    );
  }

  if (!["block", "unblock"].includes(action)) {
    throw ApiError.badRequest(
      "Action must be block or unblock"
    );
  }

  if (userId.toString() === friendId.toString()) {
    throw ApiError.badRequest(
      "You cannot block yourself"
    );
  }

  // Verify user exists
  const friendUser = await getUserById(friendId);

  if (!friendUser) {
    throw ApiError.notFound(
      "User not found"
    );
  }

  return await blockFriendRepository(
    userId,
    friendId,
    action
  );
};