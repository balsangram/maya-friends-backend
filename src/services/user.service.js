import { findUserById, findUserRepository } from "../repositories/auth.repository.js";
import { deleteUserById, findAllGlobalUsers, updateUserProfile } from "../repositories/user.repository.js";
import { deleteFromCloudinary, uploadToCloudinary } from "../utils/cloudinary.js";
import { ErrorResponse, getPagination } from "../utils/response.js";

export const displayUserDetailsServices = async (userId) => {
  console.log("findUserRepository userId:", userId);

  const user = await findUserRepository(userId);

  console.log("findUserRepository user:", user);

  return user;
};

export const editProfileService = async (
  userId,
  updateData,
  file                                                                             
) => {
  // Find user
  const existingUser = await findUserById(userId);

  if (!existingUser) {
    throw new Error("User not found");
  }

  // Upload new profile image
  if (file) {
    const uploadedImage = await uploadToCloudinary(
      file.path,
      "joms/profile"
    );

    updateData.profileImage = uploadedImage.url;
    updateData.profileImagePublicId = uploadedImage.publicId;

    // Delete old image
    if (existingUser.profileImagePublicId) {
      await deleteFromCloudinary(
        existingUser.profileImagePublicId
      );
    }
  }

  // Update user
  const updatedUser = await updateUserProfile(
    userId,
    updateData
  );

  return updatedUser;
};

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

export const deleteUserService = async (userId) => {
  // Find user
  const user = await findUserById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  // Delete profile image from Cloudinary
  if (user.profileImagePublicId) {
    await deleteFromCloudinary(
      user.profileImagePublicId
    );
  }

  // Delete user from MongoDB
  await deleteUserById(userId);

  return true;
};