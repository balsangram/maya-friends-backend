import asyncHandler from "../utils/asyncHandler.js";
import { loginUserService, registerUserService } from "../services/auth.service.js";
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
  // Implementation for logout
});

export const forgotPassword = asyncHandler(async (req, res) => {
  // Implementation for forgot password
});

export const changePassword = asyncHandler(async (req, res) => {
  // Implementation for change password
});

export const sendOtp = asyncHandler(async (req, res) => {
  // Implementation for send OTP
});

export const verifyOtp = asyncHandler(async (req, res) => {
  // Implementation for verify OTP
});

