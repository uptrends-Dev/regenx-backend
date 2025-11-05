import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
/**
 * Connect to MongoDB with caching to avoid creating multiple connections
 * when running in serverless environments (like Vercel).
 */
export default async function databaseConnection() {
  try {
    // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
    if (mongoose.connection.readyState === 1) {
      console.log("mongo already connected");
      return mongoose.connection;
    }

    if (mongoose.connection.readyState === 2) {
      // currently connecting - wait for it to finish
      console.log("mongo is connecting...");
      return mongoose.connection;
    }

    await mongoose.connect(process.env.MONGO_URL, {
      // keep defaults, but you can add options if needed
    });
    console.log("mongo connected successfully");
    return mongoose.connection;
  } catch (error) {
    console.log("error connecting to mongodb", error);
    throw error;
  }
}
