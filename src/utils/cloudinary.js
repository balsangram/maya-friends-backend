import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import env from "../config/env.js   ";

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
});

// Upload image or video
export const uploadToCloudinary = async (filePath, folder = "uploads") => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder,
      resource_type: "auto",
    });

    // Delete local file after successful Cloudinary upload
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    return {
      url: result.secure_url,
      publicId: result.public_id,
      resourceType: result.resource_type,
    };
  } catch (error) {
    // Delete local file if Cloudinary upload fails
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    throw new Error(`Cloudinary upload failed: ${error.message}`);
  }
};

// Delete file from Cloudinary
export const deleteFromCloudinary = async (
  publicId,
  resourceType = "image"
) => {
  try {
    return await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });
  } catch (error) {
    throw new Error(`Cloudinary delete failed: ${error.message}`);
  }
};

export default cloudinary;