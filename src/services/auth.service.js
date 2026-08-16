import { generateAccessToken, generateRefreshToken } from "../utils/jwt.js";
import { errorResponse } from "../utils/response.js";

export const registerUserService = async (userData) => {
  const { username, email, password } = userData;
   const newUsername = await checkIsUserNameExist(username);
   if (username) {
     throw new errorResponse("Username already exists");
   }
   const newUser = await checkIsEmailExist(email);
   if (newUser) {
     throw new errorResponse("Email already exists");
   }
    return newUser(username, email, password);
};

export const loginUserService = async (loginData) => {
  const { email, password, fcmToken } = loginData;
    const user = await findUserByEmail(email);
    if (!user) {
      throw new errorResponse("User not found");
    }
    const isPasswordValid = await validatePassword(password, user.password);
    if (!isPasswordValid) {
      throw new errorResponse("Invalid password");
    }
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    await updateUserFcmToken(user._id, fcmToken);
    return { ...user.toObject(), accessToken, refreshToken };
}