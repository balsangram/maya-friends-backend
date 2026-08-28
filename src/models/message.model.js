import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    chatId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
      required: true,
      index: true,
    },

    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // Message type
    messageType: {
      type: String,
      enum: [
        "text",
        "image",
        "video",
        "audio",
        "file",
      ],
      default: "text",
    },

    // Text message
    message: {
      type: String,
      trim: true,
      maxlength: 5000,
    },

    // Media information
    media: {
      url: {
        type: String,
        trim: true,
      },

      mediaId: {
        type: String,
        trim: true,
      },

      fileName: {
        type: String,
        trim: true,
      },

      fileSize: {
        type: Number,
      },

      mimeType: {
        type: String,
        trim: true,
      },

      duration: {
        type: Number,
      },
    },

    // Forward/share message
    isForwarded: {
      type: Boolean,
      default: false,
    },

    forwardedFrom: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
      default: null,
    },

    // Reply to another message
    replyTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
      default: null,
    },

    // Message deleted
    isDeleted: {
      type: Boolean,
      default: false,
    },

    deletedAt: {
      type: Date,
      default: null,
    },

    // Message edited
    isEdited: {
      type: Boolean,
      default: false,
    },

    editedAt: {
      type: Date,
      default: null,
    },

    // Users who have read this message
    readBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const Message = mongoose.model(
  "Message",
  messageSchema
);