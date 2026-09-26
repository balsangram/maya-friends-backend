import {
  createPostService,
  deletePostService,
  displayPostsService,
  editPostService,
} from "../services/post.services.js";

import asyncHandler from "../utils/asyncHandler.js";

import ApiError from "../utils/ApiError.js";

import {
  getPagination,
  paginationResponse,
  successResponse,
} from "../utils/response.js";

// ==============================
// Create Post
// ==============================

export const createPost = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  await createPostService(
    userId,
    req.body,
    req.files
  );

  return successResponse(
    res,
    "Post created successfully",
    null,
    201
  );
});

// ==============================
// Edit Post
// ==============================

export const editPost = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { postId } = req.params;

  console.log("User ID:", userId);
  console.log("Post ID:", postId);

  await editPostService(
    userId,
    postId,
    req.body,
    req.files || {}
  );

  return successResponse(
    res,
    "Post updated successfully",
    null,
    200
  );
});
// ==============================
// Delete Post
// ==============================

export const deletePost = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const { postId } = req.params;

  await deletePostService(
    userId,
    postId
  );

  return successResponse(
    res,
    "Post deleted successfully",
    null,
    200
  );
});

// ==============================
// Display Posts
// ==============================

export const displayPosts = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const {
    type = "all",
    page = 1,
    limit = 10,
  } = req.query;

  const allowedTypes = [
    "my",
    "all",
    "friends",
  ];

  if (!allowedTypes.includes(type)) {
    throw new ApiError(
      400,
      "Invalid type. Use my, all or friends"
    );
  }

  const pagination = getPagination(
    page,
    limit
  );

  const {
    posts,
    total,
  } = await displayPostsService(
    userId,
    type,
    pagination.page,
    pagination.limit
  );

  return paginationResponse(
    res,
    "Posts retrieved successfully",
    posts,
    pagination.page,
    pagination.limit,
    total,
    200
  );
});

export const toggleLike = asyncHandler(
  async (req, res) => {
    const userId = req.user.id;
    const { postId } = req.params;

    const result = await toggleLikeService(
      postId,
      userId
    );

    return successResponse(
      res,
      result.isLiked
        ? "Post liked successfully"
        : "Post unliked successfully",
      result,
      200
    );
  }
);

export const addComment = asyncHandler(
  async (req, res) => {
    const userId = req.user.id;
    const { postId } = req.params;

    const { comment } = req.body;

    if (
      !comment ||
      typeof comment !== "string" ||
      !comment.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Comment is required",
      });
    }

    const result = await addCommentService(
      postId,
      userId,
      comment
    );

    return successResponse(
      res,
      "Comment added successfully",
      result,
      201
    );
  }
);

export const getComments = asyncHandler(
  async (req, res) => {
    const { postId } = req.params;

    const {
      page = 1,
      limit = 20,
    } = req.query;

    const result = await getCommentsService(
      postId,
      page,
      limit
    );

    return successResponse(
      res,
      "Comments fetched successfully",
      result,
      200
    );
  }
);

export const deleteComment = asyncHandler(
  async (req, res) => {
    const userId = req.user.id;

    const {
      postId,
      commentId,
    } = req.params;

    await deleteCommentService(
      postId,
      commentId,
      userId
    );

    return successResponse(
      res,
      "Comment deleted successfully",
      null,
      200
    );
  }
);