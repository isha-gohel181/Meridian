import EmailOtpChallenge from "../models/EmailOtpChallenge.js";

const normalizeEmail = (email) => String(email || "").toLowerCase().trim();

export async function isOtpResendInCooldown(email) {
  const doc = await EmailOtpChallenge.findOne({ email: normalizeEmail(email) }).lean();
  if (!doc?.cooldownUntil) return false;
  return doc.cooldownUntil.getTime() > Date.now();
}

export async function recordOtpSend(email, otp) {
  const normalized = normalizeEmail(email);
  const now = Date.now();
  await EmailOtpChallenge.findOneAndUpdate(
    { email: normalized },
    {
      $set: {
        otp,
        attempts: 0,
        otpExpiresAt: new Date(now + 600 * 1000),
        cooldownUntil: new Date(now + 60 * 1000),
      },
    },
    { upsert: true, new: true }
  );
}

export async function verifyEmailOtp(email, otp) {
  const normalized = normalizeEmail(email);
  const doc = await EmailOtpChallenge.findOne({ email: normalized });

  if (!doc) {
    return { ok: false, status: 400, message: "OTP is invalid or expired", err: "Invalid or expired OTP" };
  }

  const attempts = (doc.attempts || 0) + 1;
  doc.attempts = attempts;
  await doc.save();

  if (attempts === 1 && !doc.otpExpiresAt) {
    doc.otpExpiresAt = new Date(Date.now() + 600 * 1000);
    await doc.save();
  }

  if (attempts > 5) {
    await EmailOtpChallenge.deleteOne({ email: normalized });
    return {
      ok: false,
      status: 429,
      message: "Too many failed attempts. Please request a new OTP.",
      err: "Max OTP verification attempts exceeded",
    };
  }

  if (!doc.otp || !doc.otpExpiresAt || doc.otpExpiresAt.getTime() <= Date.now()) {
    return { ok: false, status: 400, message: "OTP is invalid or expired", err: "Invalid or expired OTP" };
  }

  if (doc.otp !== otp.toString()) {
    const remaining = Math.max(0, 5 - attempts);
    return {
      ok: false,
      status: 400,
      message: `Invalid OTP. ${remaining} attempt${remaining === 1 ? "" : "s"} remaining.`,
      err: "OTP mismatch",
    };
  }

  await EmailOtpChallenge.deleteOne({ email: normalized });
  return { ok: true };
}
