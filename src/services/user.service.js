import { findUserById, findUserRepository } from "../repositories/auth.repository.js";
import { deleteUserById, findAllGlobalUsers, updateUserProfile } from "../repositories/user.repository.js";
import { deleteFromCloudinary, uploadToCloudinary } from "../utils/cloudinary.js";
import { ErrorResponse, getPagination } from "../utils/response.js";

export const displayUserDetailsService = async (userId) => {
  const user = await findUserRepository(userId);

  return user;
};

export const editProfileService = async (
  userId,
  updateData,
  file
) => {
  const existingUser = await findUserById(userId);

  if (!existingUser) {
    throw new Error("User not found");
  }

  const profileData = {
    ...updateData,
  };

  let oldProfileImagePublicId = null;

  // ==============================
  // Profile Image
  // ==============================

  if (file) {
    const uploadedImage = await uploadToCloudinary(
      file.path,
      "joms/profile"
    );

    profileData.profileImage = uploadedImage.url;
    profileData.profileImagePublicId =
      uploadedImage.publicId;

    oldProfileImagePublicId =
      existingUser.profileImagePublicId;
  }

  // ==============================
  // Update Profile
  // ==============================

  const updatedUser = await updateUserProfile(
    userId,
    profileData
  );

  if (!updatedUser) {
    throw new Error("Failed to update profile");
  }

  // ==============================
  // Delete Old Image
  // ==============================

  if (oldProfileImagePublicId) {
    await deleteFromCloudinary(
      oldProfileImagePublicId
    );
  }

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