import Auth from "./auth.model.js";

const userSchema = new Auth.base.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
  },

  bio: {
    type: String,
    default: "",
  },

  dateOfBirth: {
    type: Date,
    default: null,
  },

  gender: {
    type: String,
    enum: ["male", "female", "other"],
    default: null,
  },

  isProfilePublic: {
    type: Boolean,
    default: true,
  },

  friends: [
    {
      type: Auth.base.Schema.Types.ObjectId,
      ref: "Auth",
    },
  ],

  blockedUsers: [
    {
      type: Auth.base.Schema.Types.ObjectId,
      ref: "Auth",
    },
  ],
});

const User = Auth.discriminator("User", userSchema);

export default User;