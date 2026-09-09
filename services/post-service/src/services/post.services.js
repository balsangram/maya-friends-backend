import {
  createPostRepository,
  deletePostRepository,
  findPostByIdRepository,
  findPostsRepository,
  updatePostRepository,
} from "../repositories/post.repository.js";

import {
  deleteFromCloudinary,
  uploadToCloudinary,
} from "../utils/cloudinary.js";

import ApiError from "../utils/ApiError.js";

// ======================================================
// Helper: Upload Images
// ======================================================

const uploadImages = async (files = []) => {
  const images = [];

  for (const file of files) {
    const result = await uploadToCloudinary(
      file,
      "joms/posts/images"
    );

    images.push({
      url: result.url,
      mediaId: result.publicId,
    });
  }

  return images;
};

// ======================================================
// Helper: Upload Videos
// ======================================================

const uploadVideos = async (files = []) => {
  const videos = [];

  for (const file of files) {
    const result = await uploadToCloudinary(
      file,
      "joms/posts/videos"
    );

    videos.push({
      url: result.url,
      mediaId: result.publicId,
    });
  }

  return videos;
};

// ======================================================
// Helper: Delete Media
// ======================================================

const deleteMedia = async (media = []) => {
  for (const item of media) {
    if (!item?.mediaId) {
      continue;
    }

    try {
      await deleteFromCloudinary(item.mediaId);
    } catch (error) {
      console.error(
        "Cloudinary delete error:",
        item.mediaId,
        error.message
      );
    }
  }
};

// ======================================================
// CREATE POST
// ======================================================

export const createPostService = async (
  userId,
  postData = {},
  files = {}
) => {
  const uploadedImages = [];
  const uploadedVideos = [];

  try {
    // ------------------------------------------
    // Upload Images
    // ------------------------------------------

    if (files?.images?.length) {
      const images = await uploadImages(
        files.images
      );

      uploadedImages.push(...images);
    }

    // ------------------------------------------
    // Upload Videos
    // ------------------------------------------

    if (files?.videos?.length) {
      const videos = await uploadVideos(
        files.videos
      );

      uploadedVideos.push(...videos);
    }

    // ------------------------------------------
    // Create MongoDB Post
    // ------------------------------------------

    const post = await createPostRepository({
      userId,

      description:
        typeof postData.description === "string"
          ? postData.description.trim()
          : "",

      images: uploadedImages,

      videos: uploadedVideos,
    });

    return post;

  } catch (error) {
    // ------------------------------------------
    // MongoDB failed after Cloudinary upload
    // ------------------------------------------

    await deleteMedia(uploadedImages);
    await deleteMedia(uploadedVideos);

    throw error;
  }
};

// ======================================================
// EDIT POST
// ======================================================

export const editPostService = async (
  userId,
  postId,
  updateData = {},
  files = {}
) => {
  // ------------------------------------------
  // Find Post
  // ------------------------------------------

  const existingPost =
    await findPostByIdRepository(postId);

  if (!existingPost) {
    throw ApiError.notFound(
      "Post not found"
    );
  }

  // ------------------------------------------
  // Check Owner
  // ------------------------------------------

  if (
    existingPost.userId.toString() !==
    userId.toString()
  ) {
    throw ApiError.forbidden(
      "You are not allowed to edit this post"
    );
  }

  // ------------------------------------------
  // Only allow editable fields
  // ------------------------------------------

  const postData = {};

  if (
    Object.prototype.hasOwnProperty.call(
      updateData,
      "description"
    )
  ) {
    postData.description =
      typeof updateData.description === "string"
        ? updateData.description.trim()
        : "";
  }

  const newImages = [];
  const newVideos = [];

  try {
    // ==========================================
    // New Images
    // ==========================================

    if (files?.images?.length) {
      const images = await uploadImages(
        files.images
      );

      newImages.push(...images);

      /*
        Replace old images with new images.
      */
      postData.images = images;
    }

    // ==========================================
    // New Videos
    // ==========================================

    if (files?.videos?.length) {
      const videos = await uploadVideos(
        files.videos
      );

      newVideos.push(...videos);

      /*
        Replace old videos with new videos.
      */
      postData.videos = videos;
    }

    // ==========================================
    // Update MongoDB
    // ==========================================

    const updatedPost =
      await updatePostRepository(
        postId,
        postData
      );

    if (!updatedPost) {
      throw ApiError.notFound(
        "Post not found"
      );
    }

    // ==========================================
    // Delete Old Images
    // ==========================================

    if (files?.images?.length) {
      await deleteMedia(
        existingPost.images
      );
    }

    // ==========================================
    // Delete Old Videos
    // ==========================================

    if (files?.videos?.length) {
      await deleteMedia(
        existingPost.videos
      );
    }

    return updatedPost;

  } catch (error) {
    /*
      If MongoDB update fails after uploading
      new media, remove newly uploaded files.
    */

    await deleteMedia(newImages);
    await deleteMedia(newVideos);

    throw error;
  }
};

// ======================================================
// DELETE POST
// ======================================================

export const deletePostService = async (
  userId,
  postId
) => {
  // ------------------------------------------
  // Find Post
  // ------------------------------------------

  const existingPost =
    await findPostByIdRepository(postId);

  if (!existingPost) {
    throw ApiError.notFound(
      "Post not found"
    );
  }

  // ------------------------------------------
  // Check Owner
  // ------------------------------------------

  if (
    existingPost.userId.toString() !==
    userId.toString()
  ) {
    throw ApiError.forbidden(
      "You are not allowed to delete this post"
    );
  }

  // ------------------------------------------
  // Delete MongoDB Post First
  // ------------------------------------------

  await deletePostRepository(postId);

  // ------------------------------------------
  // Delete Images
  // ------------------------------------------

  await deleteMedia(
    existingPost.images
  );

  // ------------------------------------------
  // Delete Videos
  // ------------------------------------------

  await deleteMedia(
    existingPost.videos
  );

  return true;
};

// ======================================================
// DISPLAY POSTS
// ======================================================

export const displayPostsService = async (
  userId,
  type,
  page,
  limit
) => {
  let filter = {};

  // ------------------------------------------
  // My Posts
  // ------------------------------------------

  if (type === "my") {
    filter.userId = userId;
  }

  // ------------------------------------------
  // All Posts
  // ------------------------------------------

  if (type === "all") {
    filter = {};
  }

  // ------------------------------------------
  // Friends Posts
  // ------------------------------------------

  if (type === "friends") {
    throw ApiError.badRequest(
      "Friends post functionality is not implemented yet"
    );
  }

  // ------------------------------------------
  // Pagination
  // ------------------------------------------

  const skip =
    (page - 1) * limit;

  return await findPostsRepository(
    filter,
    skip,
    limit
  );
};