// src/database/connection.ts

import mongoose from "mongoose";
import { logger } from "../utils/logger";
import { config } from "../config";

/**
 * Connects to MongoDB using mongoose.
 */
const connectDB = async (): Promise<any> => {
  try {
    mongoose.set("strictQuery", true); // Ensures safe queries
    await mongoose.connect(config.db.url);

    logger.info("✅ MongoDB connected successfully");

    return {
      success: true,
      state: mongoose.connection.readyState,
      host: mongoose.connection.host,
    };
  } catch (error: any) {
    logger.error("❌ MongoDB connection error:", error);
    return {
      success: false,
      state: mongoose.connection.readyState,
      reason: error.message,
      code: error.code || null,
      name: error.name || null,
    };
    process.exit(1); // Exit process if DB connection fails
  }
};

export default connectDB;
