// src/utils/logger.ts
import { createLogger, format, transports } from 'winston';
import path from 'path';

const { combine, timestamp, printf, colorize, errors } = format;

// Custom log format
const logFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} [${level}]: ${stack || message}`;
});

// Choose log file paths safely
const errorLogPath =
  process.env.NODE_ENV === 'production'
    ? '/tmp/error.log' // ✅ absolute path for Vercel
    : path.join(__dirname, '../../logs/error.log');

const combinedLogPath =
  process.env.NODE_ENV === 'production'
    ? '/tmp/combined.log' // ✅ absolute path for Vercel
    : path.join(__dirname, '../../logs/combined.log');

export const logger = createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    errors({ stack: true }), // capture stack traces
    logFormat,
  ),
  transports: [
    new transports.Console({
      format: combine(colorize(), logFormat),
    }),
    new transports.File({ filename: errorLogPath, level: 'error' }),
    new transports.File({ filename: combinedLogPath }),
  ],
});

// Example usage
// logger.info("Server started successfully");
// logger.error(new Error("Something went wrong"));
