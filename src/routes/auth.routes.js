import express from "express";

import {
  login,
  register,
  logout,
  forgotPassword,
  changePassword,
  sendOtp,
  verifyOtp,
} from "../controllers/auth.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import authorize from "../middlewares/authorize.middleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout",authMiddleware,authorize("User"), logout);

router.post("/forgot-password", forgotPassword);
router.post("/change-password",authMiddleware,authorize("User"), changePassword);

router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);

export default router;