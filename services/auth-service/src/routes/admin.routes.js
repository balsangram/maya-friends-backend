import express from "express";

import {
  displayProfile,
  editProfile,
} from "../controllers/admin.controller.js";

const router = express.Router();

router.get("/v1/profile", displayProfile);
router.put("/v1/profile", editProfile);

export default router;