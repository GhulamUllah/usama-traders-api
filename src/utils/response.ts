// src/utils/apiResponse.ts

import { Response } from "express";
/**
 * A standardized API response format
 */

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: any;
  statusCode: number;
}

export const successResponse = (
  res: Response,
  statusCode: number,
  message: string,
  data?: any,
) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data: data ?? null,
  });
};

export const errorResponse = (
  res: Response,
  statusCode: number,
  message: string,
  errors?: any,
) => {
  return res.status(statusCode).json({
    success: false,
    message,
    errors: errors ?? null,
  });
};
