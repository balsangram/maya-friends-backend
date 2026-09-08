import express from "express";

import authMiddleware from "../middlewares/auth.middleware.js";
import authorize from "../middlewares/authorize.middleware.js";

import {
  createPlan,
  editPlan,
  deletePlan,
  displayPlans,
} from "../controllers/plan.controller.js";

const router = express.Router();

// Create plan
router.post(
  "/v1",
  authMiddleware,
  authorize("Admin"),
  createPlan
);

// Edit plan
router.patch(
  "/v1/:planId",
  authMiddleware,
  authorize("Admin"),
  editPlan
);

// Delete plan
router.delete(
  "/v1/:planId",
  authMiddleware,
  authorize("Admin"),
  deletePlan
);

// Display all plans
router.get(
  "/v1",
  authMiddleware,
  authorize("Admin"),
  displayPlans
);

export default router;