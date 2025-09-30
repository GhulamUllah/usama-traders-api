// src/server.ts
import http from 'http';
import dotenv from 'dotenv';
import app from './app';
import { logger } from './utils/logger';
import rateLimit from 'express-rate-limit';
import connectDB from './database/connection';

// Load environment variables
dotenv.config();

const PORT = process.env.PORT;

// ====== Rate Limiter ======
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per window
  message: { success: false, message: 'Too many requests, please try again later.' },
});

app.use('/api', apiLimiter);

// ====== Create Server ======
const server = http.createServer(app);
connectDB()
  .then(() => {
    // ====== Start Server ======
    server.listen(PORT, () => {
      logger.info(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    logger.error('❌ Database connection failed:', error);
    process.exit(1); // Exit process with failure
  });

// ====== Graceful Shutdown ======
const shutdown = (signal: string) => {
  process.on(signal, () => {
    logger.warn(`\n${signal} received. Closing server...`);
    server.close(() => {
      logger.info('✅ Server closed gracefully.');
      process.exit(0);
    });
  });
};

['SIGINT', 'SIGTERM'].forEach((sig) => shutdown(sig));
