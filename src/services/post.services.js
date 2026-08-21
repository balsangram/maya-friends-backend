import { createPostRepository, deletePostRepository, findPostByIdRepository, findPostsRepository, updatePostRepository } from "../repositories/post.repository.js";
import { deleteFromCloudinary, uploadToCloudinary } from "../utils/cloudinary.js";

export const createPostService = async (
  userId,
  postData,
  files
) => {
  const images = [];
  const videos = [];

  // ==============================
  // Upload Images
  // ==============================

  if (files?.images?.length) {
    for (const file of files.images) {
      const result = await uploadToCloudinary(
        file.path,
        "joms/posts/images"
      );

      images.push({
        url: result.url,
        mediaId: result.publicId,
      });
    }
  }

  // ==============================
  // Upload Videos
  // ==============================

  if (files?.videos?.length) {
    for (const file of files.videos) {
      const result = await uploadToCloudinary(
        file.path,
        "joms/posts/videos"
      );

      videos.push({
        url: result.url,
        mediaId: result.publicId,
      });
    }
  }

  // ==============================
  // Create Post
  // ==============================

  return await createPostRepository({
    userId,
    description: postData.description || "",
    images,
    videos,
  });
};

export const editPostService = async (
  userId,
  postId,
  updateData,
  files
) => {
  const existingPost =
    await findPostByIdRepository(postId);

  if (!existingPost) {
    throw new Error("Post not found");
  }

  // ==============================
  // Check Owner
  // ==============================

  if (
    existingPost.userId.toString() !==
    userId.toString()
  ) {
    throw new Error(
      "You are not allowed to edit this post"
    );
  }

  const postData = {
    ...updateData,
  };

  // ==============================
  // New Images
  // ==============================

  if (files?.images?.length) {
    const images = [];

    for (const file of files.images) {
      const result = await uploadToCloudinary(
        file.path,
        "joms/posts/images"
      );

      images.push({
        url: result.url,
        mediaId: result.publicId,
      });
    }

    postData.images = images;

    // Delete old images
    for (const image of existingPost.images) {
      if (image.mediaId) {
        await deleteFromCloudinary(
          image.mediaId
        );
      }
    }
  }

  // ==============================
  // New Videos
  // ==============================

  if (files?.videos?.length) {
    const videos = [];

    for (const file of files.videos) {
      const result = await uploadToCloudinary(
        file.path,
        "joms/posts/videos"
      );

      videos.push({
        url: result.url,
        mediaId: result.publicId,
      });
    }

    postData.videos = videos;

    // Delete old videos
    for (const video of existingPost.videos) {
      if (video.mediaId) {
        await deleteFromCloudinary(
          video.mediaId
        );
      }
    }
  }

  return await updatePostRepository(
    postId,
    postData
  );
};

export const deletePostService = async (
  userId,
  postId
) => {
  const existingPost =
    await findPostByIdRepository(postId);

  if (!existingPost) {
    throw new Error("Post not found");
  }

  // ==============================
  // Check Owner
  // ==============================

  if (
    existingPost.userId.toString() !==
    userId.toString()
  ) {
    throw new Error(
      "You are not allowed to delete this post"
    );
  }

  // ==============================
  // Delete Images
  // ==============================

  for (const image of existingPost.images) {
    if (image.mediaId) {
      await deleteFromCloudinary(
        image.mediaId
      );
    }
  }

  // ==============================
  // Delete Videos
  // ==============================

  for (const video of existingPost.videos) {
    if (video.mediaId) {
      await deleteFromCloudinary(
        video.mediaId
      );
    }
  }

  // ==============================
  // Delete MongoDB Post
  // ==============================

  await deletePostRepository(postId);
};

export const displayPostsService = async (
  userId,
  type,
  page,
  limit
) => {
  let filter = {};

  // ==============================
  // My Posts
  // ==============================

  if (type === "my") {
    filter.userId = userId;
  }

  // ==============================
  // All Posts
  // ==============================

  if (type === "all") {
    filter = {};
  }

  // ==============================
  // Friends Posts
  // ==============================

  if (type === "friends") {
    throw new Error(
      "Friends post functionality is not implemented yet"
    );
  }

  const skip = (page - 1) * limit;

  return await findPostsRepository(
    filter,
    skip,
    limit
  );
};