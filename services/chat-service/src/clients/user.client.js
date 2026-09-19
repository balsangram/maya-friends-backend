import axios from "axios";
import env from "../config/env.js";


// ========================================
// Auth / User Service Client
// ========================================
const userServiceClient = axios.create({
  baseURL: env.AUTH_SERVICE_URL,
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});


// ========================================
// Get User By ID
// ========================================
export const getUserById = async (userId) => {
  if (!userId) {
    throw new Error("User ID is required");
  }

  try {
    console.log("\n=================================");
    console.log("GET USER BY ID");
    console.log("=================================");
    console.log("Auth Service URL:", env.AUTH_SERVICE_URL);
    console.log("User ID:", userId);

    const endpoint = `/api/users/${userId}`;

    console.log("Endpoint:", endpoint);

    const response = await userServiceClient.get(endpoint);

    console.log("Status:", response.status);
    console.log("Response:", response.data);
    console.log("=================================\n");

    return response.data?.data ?? response.data ?? null;

  } catch (error) {
    console.error("\n=================================");
    console.error("GET USER BY ID ERROR");
    console.error("=================================");
    console.error("User ID:", userId);
    console.error("Status:", error.response?.status);
    console.error(
      "Response:",
      error.response?.data || null
    );
    console.error("Message:", error.message);
    console.error("=================================\n");

    // User does not exist
    if (error.response?.status === 404) {
      return null;
    }

    throw error;
  }
};


// ========================================
// Get Multiple Users By IDs
// ========================================
export const getUsersByIds = async (userIds) => {
  if (!Array.isArray(userIds) || userIds.length === 0) {
    return [];
  }

  try {
    console.log("\n=================================");
    console.log("GET USERS BY IDS");
    console.log("=================================");
    console.log("Auth Service URL:", env.AUTH_SERVICE_URL);
    console.log("User IDs:", userIds);

    const endpoint = "/api/users/by-ids";

    console.log("Endpoint:", endpoint);

    const response = await userServiceClient.post(
      endpoint,
      {
        userIds,
      }
    );

    console.log("Status:", response.status);
    console.log("Response:", response.data);
    console.log("=================================\n");

    return response.data?.data ?? response.data ?? [];

  } catch (error) {
    console.error("\n=================================");
    console.error("GET USERS BY IDS ERROR");
    console.error("=================================");
    console.error("User IDs:", userIds);
    console.error("Status:", error.response?.status);
    console.error(
      "Response:",
      error.response?.data || null
    );
    console.error("Message:", error.message);
    console.error("=================================\n");

    throw error;
  }
};


export default userServiceClient;