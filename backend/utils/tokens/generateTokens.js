import jwt from "jsonwebtoken";
import UserRefreshToken from "../../models/UserRefreshToken.js";
import AccessTokenBlacklist from "../../models/AccessTokenBlacklist.js";
import UserAccessToken from "../../models/UserAccessToken.js";
import { ServerConfig } from "../../config/server.config.js";

const platformKey = (platform) => (platform === "web" ? "web" : "app");

const storeAccessTokenForUser = async (userId, token, exp, platform = "web") => {
  const pk = platformKey(platform);
  await UserAccessToken.create({
    userId,
    platform: pk,
    token,
    expiresAt: new Date(exp),
  });
};

const getAllAccessTokensForUser = async (userId, platform = "web") => {
  const pk = platformKey(platform);
  const now = new Date();
  const docs = await UserAccessToken.find({
    userId,
    platform: pk,
    expiresAt: { $gt: now },
  }).lean();
  return docs.map((d) => d.token);
};

const cleanupExpiredAccessTokensForUser = async (userId, platform = "web") => {
  const pk = platformKey(platform);
  await UserAccessToken.deleteMany({
    userId,
    platform: pk,
    expiresAt: { $lte: new Date() },
  });
};

const clearAccessTokensForUserPlatform = async (userId, platform = "web") => {
  const pk = platformKey(platform);
  await UserAccessToken.deleteMany({ userId, platform: pk });
};

const blacklistAccessToken = async (token, exp) => {
  const ttl = Math.floor((exp - Date.now()) / 1000);
  if (ttl <= 0) return;

  await AccessTokenBlacklist.findOneAndUpdate(
    { token },
    { $set: { token, expiresAt: new Date(exp) } },
    { upsert: true }
  );
};

const isAccessTokenBlacklisted = async (token) => {
  const entry = await AccessTokenBlacklist.findOne({
    token,
    expiresAt: { $gt: new Date() },
  }).lean();
  return Boolean(entry);
};

const getTokenExp = (token) => {
  try {
    const decoded = jwt.decode(token);
    return decoded?.exp ? decoded.exp * 1000 : null;
  } catch {
    return null;
  }
};

const generateTokens = async (user, platform = "web", deviceId = null) => {
  try {
    if (!user || !user._id) {
      throw new Error("User object is missing or invalid");
    }

    const payload = { _id: user._id, roles: user.role || user.roles, platform };

    const accessSecret = process.env.JWT_ACCESS_TOKEN_SECRET_KEY || process.env.JWT_ACCESS_SECRET;
    const refreshSecret = process.env.JWT_REFRESH_TOKEN_SECRET_KEY;

    if (!accessSecret || !refreshSecret) {
      throw new Error("JWT secrets are not defined in environment variables");
    }

    const accessToken = jwt.sign(payload, accessSecret, { expiresIn: "10y" });
    const refreshToken = jwt.sign(payload, refreshSecret, { expiresIn: "10y" });

    const decodedAccess = jwt.decode(accessToken);
    const decodedRefresh = jwt.decode(refreshToken);

    const accessTokenExp = decodedAccess?.exp
      ? decodedAccess.exp * 1000
      : Date.now() + 1000 * 60 * 60 * 24 * 365 * 10;
    const refreshTokenExp = decodedRefresh?.exp
      ? decodedRefresh.exp * 1000
      : Date.now() + 1000 * 60 * 60 * 24 * 365 * 10;

    await UserRefreshToken.deleteMany({
      userId: user._id,
      platform: platform === "web" ? "web" : { $in: ["app", "android", "ios"] },
    });

    const newRefreshToken = new UserRefreshToken({
      userId: user._id,
      token: refreshToken,
      expiresAt: new Date(refreshTokenExp),
      platform: platform,
      deviceId: deviceId,
    });
    await newRefreshToken.save();

    const adminRoles = ["admin", "super_admin", "superadmin", "instructor", "news_editor"];
    const isAdmin =
      adminRoles.includes(user?.role) ||
      (Array.isArray(user?.roles) && user?.roles.some((r) => adminRoles.includes(r))) ||
      adminRoles.includes(user?.roles);

    if (!isAdmin) {
      await cleanupExpiredAccessTokensForUser(user._id, platform);
      const previousTokens = await getAllAccessTokensForUser(user._id, platform);

      if (previousTokens.length > 0) {
        const now = Date.now();
        await Promise.all(
          previousTokens.map((prevToken) => {
            const exp = getTokenExp(prevToken) || now + 1000 * 60 * 60;
            return blacklistAccessToken(prevToken, exp);
          })
        );
        await clearAccessTokensForUserPlatform(user._id, platform);
      }
    }

    await storeAccessTokenForUser(user._id, accessToken, accessTokenExp, platform);

    return {
      accessToken,
      refreshToken,
      accessTokenExp,
      refreshTokenExp,
    };
  } catch (error) {
    console.error("❌ Error in generateTokens:", error);
    throw new Error(`Token generation failed: ${error.message}`);
  }
};

const generateTokenForResetPassword = async (user) => {
  try {
    const secret = ServerConfig.JWT_EMAIL_RESET_SECRET;
    const token = jwt.sign({ userID: user._id }, secret, { expiresIn: "15m" });
    return token;
  } catch (error) {
    console.error("❌ Error in generateTokenForResetPassword:", error);
    throw new Error(`Reset token generation failed: ${error.message}`);
  }
};

export {
  generateTokens,
  generateTokenForResetPassword,
  isAccessTokenBlacklisted,
  blacklistAccessToken,
  cleanupExpiredAccessTokensForUser,
  getAllAccessTokensForUser,
  clearAccessTokensForUserPlatform,
};
