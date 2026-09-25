import mongoose from "mongoose";

const mediaSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
    },

    mediaId: {
      type: String,
      required: true,
    },
  },
  {
    _id: false,
  }
);

const postSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
      maxlength: 5000,
    },

    // Google Maps / location link
    locationLink: {
      type: String,
      default: "",
      trim: true,
    },

    // Food preference
    food: {
      type: String,
      enum: ["veg", "nonveg", "all"],
      default: "all",
    },

    // Marital status preference
    maritalStatus: {
      type: String,
      enum: ["married", "unmarried", "all"],
      default: "all",
    },

    // Profession preference
    profession: {
      type: String,
      enum: ["job", "student", "all"],
      default: "all",
    },

    // Religion preference
    religion: {
      type: String,
      enum: [
        "hindu",
        "christian",
        "muslim",
        "sikh",
        "buddhist",
        "jain",
        "other",
        "all",
      ],
      default: "all",
    },

    // Gender preference
    genderPreference: {
      type: String,
      enum: ["girl", "boy", "both"],
      default: "both",
    },

    // Minimum age preference
    minAge: {
      type: Number,
      min: 18,
      max: 100,
      default: 18,
    },

    // Maximum age preference
    maxAge: {
      type: Number,
      min: 18,
      max: 100,
      default: 100,
    },

    // Lifestyle / restrictions
    problems: {
      type: [String],
      default: [],
    },

    images: {
      type: [mediaSchema],
      default: [],
    },

    videos: {
      type: [mediaSchema],
      default: [],
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Post = mongoose.model("Post", postSchema);

export default Post;