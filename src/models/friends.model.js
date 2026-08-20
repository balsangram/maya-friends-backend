import mongoose from "mongoose";

const friendType = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auth",
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    image: {
      type: String,
      default: null,
    },

    type: {
      type: String,
      enum: ["friend", "best_friend", "close_friend"],
      default: "friend",
    },
  },
  {
    _id: false,
  }
);

const friendsSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auth",
      required: true,
      unique: true,
    },

    friends: {
      type: [friendType],
      default: [],
    },

    blockedFriends: {
      type: [friendType],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const Friends = mongoose.model("Friends", friendsSchema);

export default Friends;