import mongoose from "mongoose";

const userAccessTokenSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    platform: {
      type: String,
      enum: ["web", "app"],
      required: true,
    },
    token: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

userAccessTokenSchema.index({ userId: 1, platform: 1, expiresAt: 1 });
userAccessTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const UserAccessToken = mongoose.model("UserAccessToken", userAccessTokenSchema);

export default UserAccessToken;
