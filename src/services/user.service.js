import { findUserRepository } from "../repositories/auth.repository.js";

export const displayUserDEtrailsServices = async (userId) => {
  console.log("findUserRepository userId:", userId);
  const user = await findUserRepository(userId);
  console.log("findUserRepository user:", user);
  return user;
}