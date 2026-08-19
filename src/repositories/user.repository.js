import User from "../models/user.model.js";

export const findAllGlobalUsers = async ({
  skip = 0,
  limit = 10,
  search = "",
}) => {
  const filter = {};

  const searchValue = search?.trim();

  if (searchValue) {
    filter.$or = [
      {
        username: {
          $regex: searchValue,
          $options: "i",
        },
      },
      {
        email: {
          $regex: searchValue,
          $options: "i",
        },
      },
    ];
  }

  const [users, total] = await Promise.all([
    User.find(filter)
      .select("-password")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),

    User.countDocuments(filter),
  ]);

  return {
    users,
    total,
  };
};