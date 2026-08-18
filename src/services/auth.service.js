import { generateAccessToken, generateRefreshToken } from "../utils/jwt.js";
import { ErrorResponse, successResponse } from "../utils/response.js";
import { checkIsUserNameExist, checkIsEmailExist, findUserByEmail, validatePassword, updateFcmToken, createUser, logoutUserRepository, findUserRepository, updatePassword, isPasswordValidRepository, findUserOtpRepository, updatePasswordRepository, updateOtpRepository } from "../repositories/auth.repository.js";
import { hashPassword } from "../utils/password.js";
import { generateOtp } from "../utils/generateOtp.js";
import { verificationEmailTemplate } from "../templates/verificationEmail.js";
import { sendEmail } from "../utils/mailer.js";

export const registerUserService = async (userData) => {
  const { username, email, password } = userData;
  const isUsername = await checkIsUserNameExist(username);

  if (isUsername) {
    throw new ErrorResponse("Username already exists", 400);
  }
  const isEmail = await checkIsEmailExist(email);

  if (isEmail) {
    throw new ErrorResponse("Email already exists", 400);
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
    throw new ErrorResponse("User not found");
  }
  console.log("Comparing password:", password, user.password); // Debugging line
  const isPasswordValid = await validatePassword(password, user.password);
  console.log("Password valid:", isPasswordValid); // Debugging line
  if (!isPasswordValid) {
    throw new ErrorResponse("Invalid password");
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
    throw new ErrorResponse("User not found");
  }
  const isPasswordValid = await updatePassword(userId, newPassword);
  if (!isPasswordValid) {
    throw new ErrorResponse("Invalid password");
  }
}

export const changePasswordService = async (passwordData) => {
  const { userId, oldPassword, newPassword } = passwordData;
  console.log("changePasswordService called with:", { userId, oldPassword, newPassword });
  const user = await findUserRepository(userId);

  if (!user) {
    throw new ErrorResponse("User not found", 404);
  }
  const password = await hashPassword(newPassword);
  console.log("Hashed new password:", password);
  const hashedPassword = await hashPassword(newPassword);
  console.log("Hashed new password:", hashedPassword);
  const updatedUser = await updatePasswordRepository(
    userId,
    hashedPassword
  );

  if (!updatedUser) {
    throw new ErrorResponse("Password update failed", 400);
  }

  return {
    message: "Password changed successfully",
  };
};

export const sendOtpService = async (otpData) => {
  const { email } = otpData;
  const user = await findUserByEmail(email);
  if (!user) {
    throw new ErrorResponse("User not found");
  }
  const otp = generateOtp();
  await updateOtpRepository(user._id, otp);
  const emailHtml = verificationEmailTemplate(otp);
  await sendEmail({
    to: email,
    subject: "Email Verification",
    html: emailHtml
  });
  return user._id;
}

export const verifyOtpService = async (otpData) => {
  const { userId, otp } = otpData;
  const user = await findUserRepository(userId);
  if (!user) {
    throw new ErrorResponse("User not found");
  }
  const resentOtp = await findUserOtpRepository(userId);
  if (!resentOtp) {
    throw new ErrorResponse("OTP not found");
  }
  if (resentOtp.otp !== otp) {
    throw new ErrorResponse("Invalid OTP");
  }
  await updateOtpRepository(userId, null);
}