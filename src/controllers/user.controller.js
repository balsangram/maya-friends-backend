import { deleteUserService, displayAllGlobalUsersService, displayUserDetailsService, editProfileService } from "../services/user.service.js";
import asyncHandler from "../utils/asyncHandler.js";
import { paginationResponse, successResponse } from "../utils/response.js";

export const displayProfile = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const user = await displayUserDetailsService(userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const userResponse = {
    id: user._id,

    name: user.name,
    username: user.username,
    email: user.email,
    role: user.role,

    bio: user.bio,
    profileImage: user.profileImage,

    dateOfBirth: user.dateOfBirth,
    gender: user.gender,

    education: user.education,
    profession: user.profession,

    hobbies: user.hobbies,
    languages: user.languages,

    address: user.address,
    country: user.country,
    state: user.state,
    district: user.district,
    pin: user.pin,

    isProfilePublic: user.isProfilePublic,
  };

  return successResponse(
    res,
    "User profile retrieved successfully",
    userResponse,
    200
  );
});
export const editProfile = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  await editProfileService(
    userId,
    req.body,
    req.file
  );

  return successResponse(
    res,
    "Profile updated successfully",
    null,
    200
  );
});
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
export const deleteUser = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  await deleteUserService(userId);

  return successResponse(
    res,
    "User deleted successfully"
  );
});