import Friends from "../models/friends.model.js";


// ========================================
// Display Friends / Blocked Friends
// ========================================
export const displayAllFriendsRepository = async (
  userId,
  blockUser
) => {
  const field = blockUser
    ? "blockedFriends"
    : "friends";

  const data = await Friends.findOne(
    { userId },
    { [field]: 1, _id: 0 }
  ).lean();

  if (!data) {
    return {
      data: [],
      total: 0,
    };
  }

  const friends = data[field] || [];

  return {
    data: friends,
    total: friends.length,
  };
};


// ========================================
// Add Friend
// ========================================
export const addFriendRepository = async (
  userId,
  friendId
) => {
  return await Friends.findOneAndUpdate(
    { userId },

    {
      // Remove from blocked list if present
      $pull: {
        blockedFriends: {
          userId: friendId,
        },
      },

      // Add to friends
      $addToSet: {
        friends: {
          userId: friendId,
          type: "friend",
        },
      },
    },

    {
      new: true,
      upsert: true,
      runValidators: true,
    }
  );
};


// ========================================
// Unfriend
// ========================================
export const unfriendRepository = async (
  userId,
  friendId
) => {
  return await Friends.findOneAndUpdate(
    {
      userId,
      "friends.userId": friendId,
    },

    {
      $pull: {
        friends: {
          userId: friendId,
        },
      },
    },

    {
      new: true,
    }
  );
};


// ========================================
// Block / Unblock Friend
// ========================================
export const blockFriendRepository = async (
  userId,
  friendId,
  action
) => {
  // -----------------------------
  // BLOCK
  // -----------------------------
  if (action === "block") {
    return await Friends.findOneAndUpdate(
      { userId },

      {
        // Remove from friends
        $pull: {
          friends: {
            userId: friendId,
          },
        },

        // Add to blocked friends
        $addToSet: {
          blockedFriends: {
            userId: friendId,
            type: "friend",
          },
        },
      },

      {
        new: true,
        upsert: true,
        runValidators: true,
      }
    );
  }


  // -----------------------------
  // UNBLOCK
  // -----------------------------
  if (action === "unblock") {
    return await Friends.findOneAndUpdate(
      {
        userId,
        "blockedFriends.userId": friendId,
      },

      {
        // Remove from blocked friends
        $pull: {
          blockedFriends: {
            userId: friendId,
          },
        },

        // Add back to friends
        $addToSet: {
          friends: {
            userId: friendId,
            type: "friend",
          },
        },
      },

      {
        new: true,
        runValidators: true,
      }
    );
  }

  return null;
};