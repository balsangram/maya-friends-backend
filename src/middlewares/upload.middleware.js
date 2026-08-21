import multer from "multer";
import path from "path";
import fs from "fs";

// ==============================
// Upload folders
// ==============================

const imagePath = "uploads/images";
const videoPath = "uploads/videos";

fs.mkdirSync(imagePath, { recursive: true });
fs.mkdirSync(videoPath, { recursive: true });

// ==============================
// Storage
// ==============================

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, imagePath);
    } else if (file.mimetype.startsWith("video/")) {
      cb(null, videoPath);
    } else {
      cb(new Error("Only image and video files are allowed"), false);
    }
  },

  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname);

    const filename = `${file.fieldname}-${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}${extension}`;

    cb(null, filename);
  },
});

// ==============================
// File Filter
// ==============================

const fileFilter = (req, file, cb) => {
  const allowedImages = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
  ];

  const allowedVideos = [
    "video/mp4",
    "video/mpeg",
    "video/webm",
    "video/quicktime",
  ];

  if (
    allowedImages.includes(file.mimetype) ||
    allowedVideos.includes(file.mimetype)
  ) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Only JPG, PNG, WEBP, MP4, MPEG, WEBM and MOV files are allowed"
      ),
      false
    );
  }
};

// ==============================
// Multer
// ==============================

const upload = multer({
  storage,
  fileFilter,

  limits: {
    fileSize: 100 * 1024 * 1024,
  },
});

export default upload;