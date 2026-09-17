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
  // ==========================================
  // Find Post
  // ==========================================

  const existingPost =
    await findPostByIdRepository(postId);

  if (!existingPost) {
    throw ApiError.notFound("Post not found");
  }

  // ==========================================
  // Check Owner
  // ==========================================

  if (
    existingPost.userId.toString() !==
    userId.toString()
  ) {
    throw ApiError.forbidden(
      "You are not allowed to edit this post"
    );
  }

  // ==========================================
  // Check Updates
  // ==========================================

  const hasDescription =
    Object.prototype.hasOwnProperty.call(
      updateData,
      "description"
    );

  const hasImages =
    Array.isArray(files?.images) &&
    files.images.length > 0;

  const hasVideos =
    Array.isArray(files?.videos) &&
    files.videos.length > 0;

  if (!hasDescription && !hasImages && !hasVideos) {
    throw ApiError.badRequest(
      "Please provide something to update"
    );
  }

  // ==========================================
  // Prepare MongoDB Update
  // ==========================================

  const postData = {};

  // ==========================================
  // Description
  // ==========================================

  if (hasDescription) {
    const description =
      typeof updateData.description === "string"
        ? updateData.description.trim()
        : "";

    if (!description) {
      throw ApiError.badRequest(
        "Description cannot be empty"
      );
    }

    postData.description = description;
  }

  // ==========================================
  // IMAGE MEDIA IDs
  // ==========================================

  let imageMediaIds = [];

  if (hasImages) {
    imageMediaIds = updateData.imageMediaIds;

    if (typeof imageMediaIds === "string") {
      try {
        imageMediaIds =
          JSON.parse(imageMediaIds);
      } catch (error) {
        throw ApiError.badRequest(
          "imageMediaIds must be a valid JSON array"
        );
      }
    }

    if (!Array.isArray(imageMediaIds)) {
      throw ApiError.badRequest(
        "imageMediaIds must be an array"
      );
    }

    if (
      imageMediaIds.length !==
      files.images.length
    ) {
      throw ApiError.badRequest(
        "Number of imageMediaIds must match number of images"
      );
    }
  }

  // ==========================================
  // VIDEO MEDIA IDs
  // ==========================================

  let videoMediaIds = [];

  if (hasVideos) {
    videoMediaIds = updateData.videoMediaIds;

    if (typeof videoMediaIds === "string") {
      try {
        videoMediaIds =
          JSON.parse(videoMediaIds);
      } catch (error) {
        throw ApiError.badRequest(
          "videoMediaIds must be a valid JSON array"
        );
      }
    }

    if (!Array.isArray(videoMediaIds)) {
      throw ApiError.badRequest(
        "videoMediaIds must be an array"
      );
    }

    if (
      videoMediaIds.length !==
      files.videos.length
    ) {
      throw ApiError.badRequest(
        "Number of videoMediaIds must match number of videos"
      );
    }
  }

  // ==========================================
  // Copy Existing Media
  // ==========================================

  const updatedImages = [
    ...(existingPost.images || []),
  ];

  const updatedVideos = [
    ...(existingPost.videos || []),
  ];

  const oldImages = [];
  const oldVideos = [];

  const newImages = [];
  const newVideos = [];

  // ==========================================
  // Upload Multiple Images
  // ==========================================

  if (hasImages) {
    const uploadedImages =
      await uploadImages(files.images);

    for (let i = 0; i < imageMediaIds.length; i++) {
      const mediaId =
        imageMediaIds[i]?.trim();

      if (!mediaId) {
        throw ApiError.badRequest(
          `imageMediaIds[${i}] is required`
        );
      }

      const imageIndex =
        updatedImages.findIndex(
          (image) =>
            image.mediaId === mediaId
        );

      if (imageIndex === -1) {
        throw ApiError.notFound(
          `Image not found: ${mediaId}`
        );
      }

      // Save old image
      oldImages.push(
        updatedImages[imageIndex]
      );

      // Save new image
      newImages.push(
        uploadedImages[i]
      );

      // Replace image
      updatedImages[imageIndex] =
        uploadedImages[i];
    }

    postData.images = updatedImages;
  }

  // ==========================================
  // Upload Multiple Videos
  // ==========================================

  if (hasVideos) {
    const uploadedVideos =
      await uploadVideos(files.videos);

    for (let i = 0; i < videoMediaIds.length; i++) {
      const mediaId =
        videoMediaIds[i]?.trim();

      if (!mediaId) {
        throw ApiError.badRequest(
          `videoMediaIds[${i}] is required`
        );
      }

      const videoIndex =
        updatedVideos.findIndex(
          (video) =>
            video.mediaId === mediaId
        );

      if (videoIndex === -1) {
        throw ApiError.notFound(
          `Video not found: ${mediaId}`
        );
      }

      // Save old video
      oldVideos.push(
        updatedVideos[videoIndex]
      );

      // Save new video
      newVideos.push(
        uploadedVideos[i]
      );

      // Replace video
      updatedVideos[videoIndex] =
        uploadedVideos[i];
    }

    postData.videos = updatedVideos;
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

  if (oldImages.length > 0) {
    await deleteMedia(oldImages);
  }

  // ==========================================
  // Delete Old Videos
  // ==========================================

  if (oldVideos.length > 0) {
    await deleteMedia(oldVideos);
  }

  return updatedPost;
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