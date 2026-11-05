import mongoose from "mongoose";

const accessTokenBlacklistSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      required: true,
      unique: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  { timestamps: false }
);

accessTokenBlacklistSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const AccessTokenBlacklist = mongoose.model(
  "AccessTokenBlacklist",
  accessTokenBlacklistSchema
);

export default AccessTokenBlacklist;
