import axios from "axios";
import env from "../config/env.js";
import logger from "../utils/logger.js";

const authClient = axios.create({
  baseURL: env.AUTH_SERVICE_URL,
  timeout: 10000,
});

/**
 * Get a single user by ID from Auth/User Service
 * GET /api/user/v1/internal/:userId
 */
export const getUserById = async (userId) => {
  try {
    const { data } = await authClient.get(
      `/api/user/v1/internal/${userId}`
    );

    return data?.data || null;
  } catch (error) {
    if (error.response?.status === 404) {
      return null;
    }

    logger.error("Failed to fetch user by ID", error.message);
    throw error;
  }
};

/**
 * Get multiple users by IDs from Auth/User Service
 * POST /api/user/v1/internal/by-ids
 */
export const getUsersByIds = async (userIds) => {
  if (!Array.isArray(userIds) || userIds.length === 0) {
    return [];
  }

  try {
    const { data } = await authClient.post(
      "/api/user/v1/internal/by-ids",
      { userIds }
    );

    return data?.data || [];
  } catch (error) {
    logger.error("Failed to fetch users by IDs", error.message);
    throw error;
  }
};
