import express from "express";

import {
  displayProfile,
  editProfile,
} from "../controllers/admin.controller.js";

const router = express.Router();

router.get("/profile", displayProfile);
router.put("/profile", editProfile);

export default router;