import Post from "../models/post.model.js";

// ==============================
// Create Post
// ==============================

export const createPostRepository = async (postData) => {
  return await Post.create(postData);
};

// ==============================
// Find Post By ID
// ==============================

export const findPostByIdRepository = async (postId) => {
  return await Post.findById(postId);
};

// ==============================
// Update Post
// ==============================

export const updatePostRepository = async (
  postId,
  updateData
) => {
  return await Post.findByIdAndUpdate(
    postId,
    {
      $set: updateData,
    },
    {
      new: true,
      runValidators: true,
    }
  );
};

// ==============================
// Delete Post
// ==============================

export const deletePostRepository = async (postId) => {
  return await Post.findByIdAndDelete(postId);
};

// ==============================
// Display Posts
// ==============================

export const findPostsRepository = async (
  filter = {},
  skip = 0,
  limit = 10
) => {
  const query = {
    ...filter,
    isActive: true,
  };

  const [posts, total] = await Promise.all([
    Post.find(query)
      .sort({
        createdAt: -1,
      })
      .skip(skip)
      .limit(limit)
      .lean(),

    Post.countDocuments(query),
  ]);

  return {
    posts,
    total,
  };
};