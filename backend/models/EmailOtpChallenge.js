import mongoose from "mongoose";

const emailOtpChallengeSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    otp: {
      type: String,
      default: null,
    },
    attempts: {
      type: Number,
      default: 0,
    },
    otpExpiresAt: {
      type: Date,
      default: null,
    },
    cooldownUntil: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

emailOtpChallengeSchema.index({ otpExpiresAt: 1 }, { expireAfterSeconds: 0 });

const EmailOtpChallenge = mongoose.model("EmailOtpChallenge", emailOtpChallengeSchema);

export default EmailOtpChallenge;
