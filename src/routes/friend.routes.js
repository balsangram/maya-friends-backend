import express from "express";

import { addFriend, blockFriend, displayAllFriends, unfriend } from "../controllers/friend.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import authorize from "../middlewares/authorize.middleware.js";

const router = express.Router();

router.get("/",authMiddleware,authorize("User"), displayAllFriends);
router.post("/add",authMiddleware,authorize("User"), addFriend);
router.post("/unfriend", authMiddleware, authorize("User"), unfriend);
router.patch("block/:friendId", authMiddleware, authorize("User"), blockFriend);

export default router;