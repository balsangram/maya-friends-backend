import express from "express";

import authMiddleware from "../middlewares/auth.middleware.js";
import authorize from "../middlewares/authorize.middleware.js";

import {
  cancelPlan,
  resubscribePlan,
} from "../controllers/subscription.controller.js";

const router = express.Router();

// Cancel subscription
router.patch(
  "/v1/cancel",
  authMiddleware,
  authorize("User"),
  cancelPlan
);

// Re-subscribe
router.patch(
  "/v1/resubscribe",
  authMiddleware,
  authorize("User"),
  resubscribePlan
);

export default router;