import asyncHandler from "../utils/asyncHandler.js";
import { changePasswordService, forgotPasswordService, loginUserService, logoutUserService, registerUserService } from "../services/auth.service.js";
import { successResponse } from "../utils/response.js";

export const register = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  const user = await registerUserService({
    username,
    email,
    password,
  });

  const userResponse = {
    id: user._id,
    username: user.username,
    email: user.email,
    role: user.role,
  };

  return successResponse(
    res,
    "User registered successfully",
    userResponse,
    201
  );
});

export const login = asyncHandler(async (req, res) => {
  const { email, password ,fcmToken} = req.body;
  const user = await loginUserService({ email, password ,fcmToken});
  const userResponse = {
    id: user._id,
    username: user.username,
    email: user.email,
    role: user.role,
    accessToken: user.accessToken,
    refreshToken: user.refreshToken,
  };

  return successResponse(
    res,
    "User logged in successfully",
    userResponse,
    200
  );
});

export const logout = asyncHandler(async (req, res) => {
   const userId = req.user.id;
   const {fcmToken} = req.body;
    const user = await logoutUserService({userId ,fcmToken ,refreshToken});
   return successResponse(
    res,
    "User logged out successfully",
    user,
    200
   )

});

export const forgotPassword = asyncHandler(async (req, res) => {
  const {userId , newPassword} = req.body;
  await forgotPasswordService({userId, newPassword});
  return successResponse(
    res,
    "Password changed successfully",
    null,
    200
  );
});

export const changePassword = asyncHandler(async (req, res) => {
 const user = req.user.id;
 const {oldPassword , newPassword} = req.body;
  await changePasswordService({user,oldPassword , newPassword})
 return successResponse(
  res,
  "Change password successfully",
  null,
  200
 )
});

export const sendOtp = asyncHandler(async (req, res) => {
  const {email} = req.body;
  
});

export const verifyOtp = asyncHandler(async (req, res) => {
  // Implementation for verify OTP
});

