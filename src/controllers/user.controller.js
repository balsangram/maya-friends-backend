import { displayUserDEtrailsServices } from "../services/user.service.js";
import asyncHandler from "../utils/asyncHandler.js";
import { successResponse } from "../utils/response.js";

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
