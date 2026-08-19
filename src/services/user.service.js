import { findUserRepository } from "../repositories/auth.repository.js";
import { findAllGlobalUsers } from "../repositories/user.repository.js";
import { ErrorResponse, getPagination } from "../utils/response.js";

export const displayUserDEtrailsServices = async (userId) => {
  console.log("findUserRepository userId:", userId);
  const user = await findUserRepository(userId);
  console.log("findUserRepository user:", user);
  return user;
}

export const displayAllGlobalUsersService = async ({
  page,
  limit,
  search,
}) => {
  const pagination = getPagination(page, limit);

  const { users, total } = await findAllGlobalUsers({
    skip: pagination.skip,
    limit: pagination.limit,
    search,
  });

  if (!users) {
    throw new ErrorResponse(
      "Unable to fetch global users",
      500
    );
  }

  return {
    users,
    pagination,
  };
};