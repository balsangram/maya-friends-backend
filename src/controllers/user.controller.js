import { displayAllGlobalUsersService, displayUserDEtrailsServices } from "../services/user.service.js";
import asyncHandler from "../utils/asyncHandler.js";
import { paginationResponse, successResponse } from "../utils/response.js";

export const displayProfile = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const user = await displayUserDEtrailsServices(userId);
    const userResponse = {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
    };

   return successResponse(
    res,
    "User profile retrieved successfully",
    userResponse,
    200
   );
});
export const editProfile = asyncHandler(async (req, res) => {});

export const displayAllGlobalUsers = asyncHandler(
  async (req, res) => {
    const {
      page = 1,
      limit = 10,
      search = "",
    } = req.query;

    const result = await displayAllGlobalUsersService({
      page,
      limit,
      search,
    });

    return paginationResponse(
      res,
      "Global users fetched successfully",
      result.users,
      result.pagination.page,
      result.pagination.limit,
      result.total
    );
  }
);