// src/server.ts
import http from "http";
import dotenv from "dotenv";
import app from "./app";
import { logger } from "./utils/logger";
import rateLimit from "express-rate-limit";

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 5000;

// ====== Rate Limiter ======
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per window
  message: { success: false, message: "Too many requests, please try again later." },
});

app.use("/api", apiLimiter);

// ====== Create Server ======
const server = http.createServer(app);

// ====== Start Server ======
server.listen(PORT, () => {
  logger.info(`🚀 Server running on http://localhost:${PORT}`);
});

// ====== Graceful Shutdown ======
const shutdown = (signal: string) => {
  process.on(signal, () => {
    logger.warn(`\n${signal} received. Closing server...`);
    server.close(() => {
      logger.info("✅ Server closed gracefully.");
      process.exit(0);
    });
  });
};

["SIGINT", "SIGTERM"].forEach((sig) => shutdown(sig));
