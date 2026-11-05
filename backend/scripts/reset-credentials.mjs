/**
 * Reset admin + default student login credentials (bcrypt-hashed in DB).
 *
 * Usage (from backend/):
 *   node scripts/reset-credentials.mjs
 *   node scripts/reset-credentials.mjs --admin-email admin@example.com --admin-password 'Admin@123'
 *   node scripts/reset-credentials.mjs --student-email student@example.com --student-password 'Student@123'
 */
import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../models/user.js";

const args = process.argv.slice(2);
function getArg(name, fallback) {
  const i = args.indexOf(name);
  if (i === -1 || !args[i + 1]) return fallback;
  return args[i + 1];
}

const ADMIN_EMAIL = getArg("--admin-email", "admin@32pearlsdental.in");
const ADMIN_PASSWORD = getArg("--admin-password", "Admin@123");
const STUDENT_EMAIL = getArg("--student-email", "student@32pearlsdental.in");
const STUDENT_PASSWORD = getArg("--student-password", "Student@123");
const LEGACY_ADMIN_EMAILS = ["admin@xpertqa.in", "admin@osacademy.com"];

const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error("❌ MONGO_URI is not set in backend/.env");
  process.exit(1);
}

async function upsertUser({ email, password, role, fullName }) {
  const normalized = email.trim().toLowerCase();
  const hashed = await bcrypt.hash(password, 10);
  let user = await User.findOne({ email: normalized });
  if (!user) {
    user = await User.findOne({ email: new RegExp(`^${normalized.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i") });
  }
  if (user) {
    user.email = normalized;
    user.password = hashed;
    user.role = role;
    user.fullName = fullName;
    user.is_verify = true;
    user.emailVerified = true;
    user.status = "active";
    user.isActive = true;
    user.passwordResetToken = null;
    user.passwordResetExpiry = null;
    await user.save();
    return { action: "updated", email: normalized };
  }
  await User.create({
    fullName,
    email: normalized,
    password: hashed,
    role,
    is_verify: true,
    emailVerified: true,
    status: "active",
    isActive: true,
    profilePicture: "default-profile.png",
  });
  return { action: "created", email: normalized };
}

async function resetLegacyAdmins(hashedAdminPassword) {
  for (const legacy of LEGACY_ADMIN_EMAILS) {
    const u = await User.findOne({ email: legacy.toLowerCase() });
    if (!u) continue;
    u.password = hashedAdminPassword;
    u.is_verify = true;
    u.emailVerified = true;
    u.status = "active";
    u.isActive = true;
    if (u.role !== "super_admin") u.role = "admin";
    await u.save();
    console.log(`✅ Legacy admin password reset: ${legacy}`);
  }
}

async function resetAllAdminRoles(password) {
  const hashed = await bcrypt.hash(password, 10);
  const result = await User.updateMany(
    { role: { $in: ["admin", "super_admin"] } },
    {
      $set: {
        password: hashed,
        is_verify: true,
        emailVerified: true,
        status: "active",
        isActive: true,
        passwordResetToken: null,
        passwordResetExpiry: null,
      },
    }
  );
  console.log(`✅ Reset password for ${result.modifiedCount} admin/super_admin account(s)`);
  return hashed;
}

async function main() {
  const safeUri = MONGO_URI.replace(/:[^:@]+@/, ":***@");
  console.log("Connecting to MongoDB:", safeUri);
  await mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 30000 });
  console.log("✅ Connected\n");

  const adminHash = await bcrypt.hash(ADMIN_PASSWORD, 10);
  await resetLegacyAdmins(adminHash);
  await resetAllAdminRoles(ADMIN_PASSWORD);

  const adminResult = await upsertUser({
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
    role: "admin",
    fullName: "32 Pearls Admin",
  });
  console.log(`✅ Admin ${adminResult.action}: ${adminResult.email}`);

  const studentResult = await upsertUser({
    email: STUDENT_EMAIL,
    password: STUDENT_PASSWORD,
    role: "student",
    fullName: "32 Pearls Student",
  });
  console.log(`✅ Student ${studentResult.action}: ${studentResult.email}`);

  const admins = await User.find({ role: { $in: ["admin", "super_admin"] } })
    .select("email role")
    .lean();
  console.log("\n=============================================");
  console.log("Admin panel (all admin/super_admin use same password now):");
  admins.forEach((a) => console.log(`  📧 ${a.email} (${a.role})`));
  console.log(`  🔑 Password: ${ADMIN_PASSWORD}`);
  console.log("---------------------------------------------");
  console.log("Student / web login:");
  console.log(`  📧 ${STUDENT_EMAIL}`);
  console.log(`  🔑 ${STUDENT_PASSWORD}`);
  console.log("=============================================\n");

  await mongoose.disconnect();
}

main().catch((err) => {
  console.error("❌", err.message || err);
  process.exit(1);
});
