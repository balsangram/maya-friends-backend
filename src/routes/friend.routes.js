import express from "express";

import { addFriend, blockFriend, displayAllFriends, unfriend } from "../controllers/friend.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import authorize from "../middlewares/authorize.middleware.js";

const router = express.Router();

router.get("/v1/",authMiddleware,authorize("User"), displayAllFriends);
router.post("/v1/add",authMiddleware,authorize("User"), addFriend);
router.post("/v1/unfriend", authMiddleware, authorize("User"), unfriend);
router.patch("/v1/block/:friendId", authMiddleware, authorize("User"), blockFriend);

export default router;