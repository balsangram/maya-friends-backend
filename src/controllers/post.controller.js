import { createPostService, deletePostService, displayPostsService, editPostService } from "../services/post.services.js";
import asyncHandler from "../utils/asyncHandler.js";
import { getPagination, paginationResponse, successResponse } from "../utils/response.js";

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

export const editPost = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const { postId } = req.params;

  await editPostService(
    userId,
    postId,
    req.body,
    req.files
  );

  return successResponse(
    res,
    "Post updated successfully",
    null,
    200
  );
});

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