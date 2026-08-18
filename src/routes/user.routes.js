import express from "express";

import {
  displayProfile,
  editProfile,
} from "../controllers/user.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import authorize from "../middlewares/authorize.middleware.js";

const router = express.Router();

router.get("/v1/profile", authMiddleware,authorize("User"),displayProfile);
router.put("/v1/profile", authMiddleware,authorize("User"),editProfile);

export default router;