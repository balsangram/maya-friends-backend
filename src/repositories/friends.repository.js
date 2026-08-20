import Friends from "../models/friends.model.js";

export const displayAllFriendsRepository = async (userId) => {
  return await Friends.findOne({ userId });
};

export const findUserByIdRepository = async (userId) => {
  return await Auth.findById(userId).select("name image");
};

export const addFriendRepository = async (
  userId,
  friendId,
  name,
  image
) => {
  return await Friends.findOneAndUpdate(
    { userId },
    {
      $addToSet: {
        friends: {
          userId: friendId,
          name,
          image,
        },
      },
    },
    {
      new: true,
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