import mongoose from "mongoose";

const groupMemberSchema = new mongoose.Schema(
  {
    chatId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
      required: true,
      index: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    role: {
      type: String,
      enum: ["admin", "member"],
      default: "member",
    },

    status: {
      type: String,
      enum: ["active", "blocked", "left", "removed"],
      default: "active",
    },

    joinedAt: {
      type: Date,
      default: Date.now,
    },

    leftAt: {
      type: Date,
      default: null,
    },

    removedAt: {
      type: Date,
      default: null,
    },

    blockedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Same user should not be added twice to same group
groupMemberSchema.index(
  {
    chatId: 1,
    userId: 1,
  },
  {
    unique: true,
  }
);

export const GroupMember = mongoose.model(
  "GroupMember",
  groupMemberSchema
);