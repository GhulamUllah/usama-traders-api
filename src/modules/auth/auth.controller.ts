// src/modules/auth/auth.controller.ts

import { Request, Response, NextFunction } from 'express';
import { registerSchema, loginSchema, LoginInput, RegisterInput } from './auth.validators';
import { registerUser, loginUser } from './auth.service';
import { successResponse } from '../../utils/response';

export const registerHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsedData: RegisterInput = registerSchema.parse(req.body);
    const result = await registerUser(parsedData);
    return successResponse(res, 201, 'User registered successfully', result);
  } catch (error) {
    next(error);
  }
};

export const loginHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsedData: LoginInput = loginSchema.parse(req.body);
    const result = await loginUser(parsedData);
    return successResponse(res, 200, 'Login successful', result);
  } catch (error) {
    next(error);
  }
};
