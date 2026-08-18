import { generateAccessToken, generateRefreshToken } from "../utils/jwt.js";
import { errorResponse } from "../utils/response.js";
import { checkIsUserNameExist, checkIsEmailExist, findUserByEmail, validatePassword, updateFcmToken, createUser, logoutUserRepository, findUserRepository, updatePassword, isPasswordValidRepository } from "../repositories/auth.repository.js";
import { hashPassword } from "../utils/password.js";

export const registerUserService = async (userData) => {
  const { username, email, password } = userData;
  const isUsername = await checkIsUserNameExist(username);

  if (isUsername) {
    throw new errorResponse("Username already exists");
  }
  const isEmail = await checkIsEmailExist(email);

  if (isEmail) {
    throw new errorResponse("Email already exists");
  }
  const hashedPassword =
    await hashPassword(password);


  const newUser = await createUser({ ...userData, password: hashedPassword });
  return newUser;
};

export const loginUserService = async (loginData) => {
  const { email, password, fcmToken } = loginData;
  const user = await findUserByEmail(email);
  console.log("User found:", user); // Debugging line
  if (!user) {
    throw new errorResponse("User not found");
  }
  const isPasswordValid = await validatePassword(password, user.password);
  console.log("Password valid:", isPasswordValid); // Debugging line
  if (!isPasswordValid) {
    throw new errorResponse("Invalid password");
  }
  const accessToken = generateAccessToken(user);
  console.log("Access token generated:", accessToken); // Debugging line
  const refreshToken = generateRefreshToken(user);
  await updateFcmToken(user._id, fcmToken);
  return { ...user.toObject(), accessToken, refreshToken };
}

export const logoutUserService = async (userData) => {
  const { userId, fcmToken, refreshToken } = userData;
  const user = await logoutUserRepository(userId, fcmToken, refreshToken);
  return user;
}

export const forgotPasswordService = async (passwordData) => {
  const { userId, newPassword } = passwordData;
  const user = await findUserRepository(userId);
  if (!user) {
    throw new errorResponse("User not found");
  }
  const isPasswordValid = await updatePassword(userId, newPassword);
  if (!isPasswordValid) {
    throw new errorResponse("Invalid password");
  }
}

export const changePasswordService = async (passwordData) => {
  const { userId, oldPassword, newPassword } = passwordData;
  const user = await findUserRepository(userId);
  if (!user) {
    throw new errorResponse("User not found");
  }
  const passwordValid = await isPasswordValidRepository(
    oldPassword,
    userId
  );

  if (!passwordValid) {
    throw new errorResponse("Invalid old password", 401);
  }

  const updatePassword = await updatePassword(userId, newPassword);
  if (!updatePassword) {
    throw new errorResponse("Invalid password");
  }
}