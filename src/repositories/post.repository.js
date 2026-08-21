import Post from "../models/post.model.js";

// ==============================
// Create Post
// ==============================

export const createPostRepository = async (postData) => {
  const post = await Post.create(postData);

  return post;
};

// ==============================
// Find Post By ID
// ==============================

export const findPostByIdRepository = async (postId) => {
  const post = await Post.findById(postId);

  return post;
};

// ==============================
// Update Post
// ==============================

export const updatePostRepository = async (
  postId,
  updateData
) => {
  const post = await Post.findByIdAndUpdate(
    postId,
    {
      $set: updateData,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  return post;
};

// ==============================
// Delete Post
// ==============================

export const deletePostRepository = async (postId) => {
  const post = await Post.findByIdAndDelete(postId);

  return post;
};

// ==============================
// Display Posts
// ==============================

export const findPostsRepository = async (
  filter = {},
  skip = 0,
  limit = 10
) => {
  const [posts, total] = await Promise.all([
    Post.find({
      ...filter,
      isActive: true,
    })
      .populate(
        "userId",
        "name username profileImage"
      )
      .sort({
        createdAt: -1,
      })
      .skip(skip)
      .limit(limit),

    Post.countDocuments({
      ...filter,
      isActive: true,
    }),
  ]);

  return {
    posts,
    total,
  };
};