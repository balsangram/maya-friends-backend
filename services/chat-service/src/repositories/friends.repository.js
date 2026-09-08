import Auth from "../models/auth.models.js";
import Friends from "../models/friends.model.js";

export const displayAllFriendsRepository = async (
  userId,
  search,
  blockUser,
  skip,
  limit
) => {
  const field = blockUser
    ? "blockedFriends"
    : "friends";

  const data = await Friends.findOne({ userId }).populate({
    path: `${field}.userId`,
    select: "username image",
    match: search
      ? {
          username: {
            $regex: search,
            $options: "i",
          },
        }
      : {},
  });

  if (!data) {
    return {
      data: [],
      total: 0,
    };
  }

  const filteredFriends = data[field].filter(
    (friend) => friend.userId
  );

  const total = filteredFriends.length;

  const paginatedFriends = filteredFriends.slice(
    skip,
    skip + limit
  );

  return {
    data: paginatedFriends,
    total,
  };
};

export const findUserByIdRepository = async (userId) => {
  const user = await Auth.findById(userId).select("name image");

  console.log(user, "---user");

  return user;
};

export const addFriendRepository = async (userId, friendId) => {
  return await Friends.findOneAndUpdate(
    { userId },
    {
      $addToSet: {
        friends: {
          userId: friendId,
          type: "friend",
        },
      },
    },
    {
      returnDocument: "after",
      upsert: true,
    }
  );
};
export const unfriendRepository = async (userId, friendId) => {
  return await Friends.findOneAndUpdate(
    { userId },
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

export const blockFriendRepository = async (
  userId,
  friendId,
  name,
  image,
  action
) => {
  const friendData = {
    userId: friendId,
    name,
    image,
    type: "friend",
  };

  if (action === "block") {
    return await Friends.findOneAndUpdate(
      { userId },
      {
        $pull: {
          friends: { userId: friendId },
        },
        $addToSet: {
          blockedFriends: friendData,
        },
      },
      {
        new: true,
        upsert: true,
      }
    );
  }

  if (action === "unblock") {
    return await Friends.findOneAndUpdate(
      { userId },
      {
        $pull: {
          blockedFriends: { userId: friendId },
        },
        $addToSet: {
          friends: friendData,
        },
      },
      {
        new: true,
      }
    );
  }
};
