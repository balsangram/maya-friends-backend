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

    // ------------------------------------------
    // Location
    // ------------------------------------------

    locationLink: {
      type: String,
      default: "",
      trim: true,
    },

    latitude: {
      type: Number,
      min: -90,
      max: 90,
      default: null,
    },

    longitude: {
      type: Number,
      min: -180,
      max: 180,
      default: null,
    },

    range: {
      type: Number,
      min: 1,
      max: 500,
      default: 10,
    },

    // ------------------------------------------
    // Food preference
    // ------------------------------------------

    food: {
      type: String,
      enum: ["veg", "nonveg", "all"],
      default: "all",
    },

    // ------------------------------------------
    // Marital status
    // ------------------------------------------

    maritalStatus: {
      type: String,
      enum: ["married", "unmarried", "all"],
      default: "all",
    },

    // ------------------------------------------
    // Profession
    // ------------------------------------------

    profession: {
      type: String,
      enum: ["job", "student", "all"],
      default: "all",
    },

    // ------------------------------------------
    // Religion
    // ------------------------------------------

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

    // ------------------------------------------
    // Gender preference
    // ------------------------------------------

    genderPreference: {
      type: String,
      enum: ["girl", "boy", "both"],
      default: "both",
    },

    // ------------------------------------------
    // Age preference
    // ------------------------------------------

    minAge: {
      type: Number,
      min: 18,
      max: 100,
      default: 18,
    },

    maxAge: {
      type: Number,
      min: 18,
      max: 100,
      default: 100,
    },

    // ------------------------------------------
    // Lifestyle restrictions
    // ------------------------------------------

    problems: {
      type: [String],
      default: [],
    },

    // ------------------------------------------
    // Likes
    // ------------------------------------------

    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
      },
    ],

    likesCount: {
      type: Number,
      default: 0,
    },

    // ------------------------------------------
    // Media
    // ------------------------------------------

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