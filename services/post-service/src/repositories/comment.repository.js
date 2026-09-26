import Comment from "../models/comment.model.js";

// Create comment
export const createCommentRepository = async (commentData) => {
  return await Comment.create(commentData);
};

// Find comment
export const findCommentById = async (commentId) => {
  return await Comment.findById(commentId);
};

// Get comments for post
export const getCommentsRepository = async (
  postId,
  skip = 0,
  limit = 20
) => {
  return await Comment.find({
    postId,
    isActive: true,
  })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();
};

// Delete comment
export const deleteCommentRepository = async (commentId) => {
  return await Comment.findByIdAndUpdate(
    commentId,
    {
      isActive: false,
    },
    {
      new: true,
    }
  );
};