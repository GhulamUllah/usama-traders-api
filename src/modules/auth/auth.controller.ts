// src/modules/auth/auth.controller.ts

import { Request, Response, NextFunction } from 'express';
import {
  registerSchema,
  loginSchema,
  LoginInput,
  RegisterInput,
  approveUserSchema,
  deleteUserSchema,
  assignedShopSchema,
} from './auth.validators';
import { registerUser, loginUser, getAllUsers, approveUser, deleteUser, assignShop } from './auth.service';
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
    console.log(error);
    next(error);
  }
};

export const getAllUsersHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await getAllUsers();
    return successResponse(res, 200, 'Users fetched successfully', result);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const approveUserHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsedData = approveUserSchema.parse(req.body);
    const result = await approveUser(parsedData);
    return successResponse(res, 200, 'User approved successfully', result);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const assignShopHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsedData = assignedShopSchema.parse(req.body);
    const result = await assignShop(parsedData);
    return successResponse(res, 200, 'Shop Assigned successfully', result);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const deleteUserHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsedData = deleteUserSchema.parse(req.body);
    const result = await deleteUser(parsedData);
    return successResponse(res, 200, 'User deleted successfully', result);
  } catch (error) {
    console.log(error);
    next(error);
  }
};
