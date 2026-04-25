import mongoose from "mongoose";

async function run() {
  await mongoose.connect("***REMOVED***");
  const db = mongoose.connection.useDb('test'); // The connection string doesn't specify DB? Let me check default. Default is 'test' or whatever in URI.
  // Wait, let's just list collections and find users
  const users = await db.collection('users').find({}).toArray();
  console.log("Users:", JSON.stringify(users, null, 2));
  process.exit(0);
}
run();
