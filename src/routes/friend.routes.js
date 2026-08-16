import express from "express";

import { addFriend, blockFriend, displayAllFriends, unfriend } from "../controllers/friend.controller.js";

const router = express.Router();

router.get("/friends", displayAllFriends);
router.post("/friends/add", addFriend);
router.delete("/friends/unfriend/:friendId", unfriend);
router.patch("/friends/block/:friendId", blockFriend);

export default router;