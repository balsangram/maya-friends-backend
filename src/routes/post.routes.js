import express from "express";


import authMiddleware from "../middlewares/auth.middleware.js";
import authorize from "../middlewares/authorize.middleware.js";
import upload from "../middlewares/upload.middleware.js";
import { createPost, deletePost, displayPosts, editPost } from "../controllers/post.controller.js";

const router = express.Router();

// Create post
router.post(
  "/v1",
  authMiddleware,
  authorize("User"),
  upload.fields([
    {
      name: "images",
      maxCount: 10,
    },
    {
      name: "videos",
      maxCount: 5,
    },
  ]),
  createPost
);
router.patch(
  "/v1/:postId",
  authMiddleware,
  authorize("User"),
  upload.fields([
    {
      name: "images",
      maxCount: 10,
    },
    {
      name: "videos",
      maxCount: 5,
    },
  ]),
  editPost
);
// Delete my post
router.delete(
  "/v1/:postId",
  authMiddleware,
  authorize("User"),
  deletePost
);
router.get(
  "/v1",
  authMiddleware,
  authorize("User"),
  displayPosts
);

export default router;