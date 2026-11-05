import "dotenv/config";
import mongoose from "mongoose";
import User from "../models/user.js";

const uri = process.env.MONGO_URI;
if (!uri) {
  console.error("MONGO_URI missing");
  process.exit(1);
}
await mongoose.connect(uri, { serverSelectionTimeoutMS: 30000 });
console.log("Database:", mongoose.connection.db?.databaseName);
const userCount = await User.countDocuments({});
console.log("Total users in User collection:", userCount);
const admins = await User.find({ role: { $in: ["admin", "super_admin"] } })
  .select("email role fullName")
  .lean();
console.log("Admins:", admins);
console.log(
  "Students (first 10):",
  await User.find({ role: "student" }).select("email").limit(10).lean()
);
console.log("Total students:", await User.countDocuments({ role: "student" }));
await mongoose.disconnect();
