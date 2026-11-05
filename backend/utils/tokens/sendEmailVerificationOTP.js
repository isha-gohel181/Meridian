import EmailVerificationModel from "../../models/EmailVerification.js";
import emailService from "../emailService.js";
const sendEmailVerificationOTP = async (req, user) => {
  const otp = Math.floor(1000 + Math.random() * 9000);

  await new EmailVerificationModel({ userId: user._id, otp }).save();

  const userName = user.fullName || user.name || "User";
  await emailService.sendOtpEmail(user.email, otp, userName);

  return otp;
};

export { sendEmailVerificationOTP };
