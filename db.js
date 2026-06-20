import mongoose from "mongoose";

const MONGO_URL = process.env.MONGO_URL;

if (!MONGO_URL) {
  throw new Error("❌ MONGO_URL is not defined in env");
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectToDB = async () => {
  try {
    if (cached.conn) {
      return cached.conn;
    }

    if (!cached.promise) {
      cached.promise = mongoose.connect(MONGO_URL, {
        bufferCommands: false,
      });
    }

    cached.conn = await cached.promise;

    console.log("✅ Connected to MongoDB Atlas successfully");
    return cached.conn;
  } catch (err) {
    console.log("❌ DB Connection error ->", err);
    throw err;
  }
};

export default connectToDB;