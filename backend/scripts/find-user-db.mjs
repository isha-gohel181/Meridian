import "dotenv/config";
import mongoose from "mongoose";

const baseUri = process.env.MONGO_URI;
if (!baseUri) {
  console.error("MONGO_URI missing");
  process.exit(1);
}

function uriWithDb(dbName) {
  const u = baseUri.replace(/\/+$/, "");
  if (u.match(/\/[^/?]+(\?|$)/)) return u;
  return `${u}/${dbName}`;
}

await mongoose.connect(baseUri, { serverSelectionTimeoutMS: 30000 });
const admin = mongoose.connection.db.admin();
const { databases } = await admin.listDatabases();
console.log(
  "Databases:",
  databases.map((d) => `${d.name} (${d.sizeOnDisk})`)
);

for (const db of databases) {
  if (["admin", "local"].includes(db.name)) continue;
  const conn = mongoose.connection.client.db(db.name);
  const count = await conn.collection("users").countDocuments().catch(() => -1);
  if (count > 0) {
    const sample = await conn
      .collection("users")
      .find({})
      .project({ email: 1, role: 1 })
      .limit(5)
      .toArray();
    console.log(`\n${db.name}: ${count} users`, sample);
  }
}
await mongoose.disconnect();
