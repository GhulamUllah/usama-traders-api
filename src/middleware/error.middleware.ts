// src/middleware/error.middleware.ts
import { Request, Response, NextFunction } from "express";
import { logger } from "../utils/logger";

interface ApiError extends Error {
  statusCode?: number;
  details?: any;
}

export const errorHandler = (err: ApiError, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.statusCode || 500;

  // Log error details
  logger.error(`[${req.method}] ${req.url} - ${statusCode} - ${err.message}`);

  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }), // show stack only in dev
    ...(err.details && { details: err.details }), // validation errors, etc.
  });
};
