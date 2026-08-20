import express from "express";

import { addFriend, blockFriend, displayAllFriends, unfriend } from "../controllers/friend.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import authorize from "../middlewares/authorize.middleware.js";

const router = express.Router();

router.get("/friends",authMiddleware,authorize("User"), displayAllFriends);
router.post("/friends/add",authMiddleware,authorize("User"), addFriend);
router.delete("/friends/unfriend/:friendId", authMiddleware, authorize("User"), unfriend);
router.patch("/friends/block/:friendId", authMiddleware, authorize("User"), blockFriend);

export default router;