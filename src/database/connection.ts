// src/database/connection.ts

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { logger } from '../utils/logger';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/usama-backend';

/**
 * Connects to MongoDB using mongoose.
 */
const connectDB = async (): Promise<void> => {
  try {
    mongoose.set('strictQuery', true); // Ensures safe queries
    await mongoose.connect(MONGO_URI);

    logger.info('✅ MongoDB connected successfully');
  } catch (error) {
    logger.error('❌ MongoDB connection error:', error);
    process.exit(1); // Exit process if DB connection fails
  }
};

export default connectDB;
