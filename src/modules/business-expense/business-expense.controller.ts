import { NextFunction, Response } from "express";
import { AuthRequest } from "../../middleware/auth.middleware";
import { successResponse } from "../../utils/response";
import {
  createBusiness,
  deleteBusiness,
  getAllBusinessExpense,
  updateBusiness,
} from "./business-expense.service";
import {
  CreateBusiness,
  createBusinessSchema,
  DeleteBusiness,
  deleteBusinessSchema,
  UpdateBusiness,
  updateBusinessSchema
} from "./business-expense.validators";

export const createHandler = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const parsedData: CreateBusiness = createBusinessSchema.parse(req.body);
    const result = await createBusiness(parsedData, req.user);
    return successResponse(res, 201, "Business created successfully", result);
  } catch (error) {
    next(error);
  }
};

export const updateHandler = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const parsedData: UpdateBusiness = updateBusinessSchema.parse(req.body);
    const result = await updateBusiness(parsedData, req.user);
    return successResponse(res, 201, "Business updated successfully", result);
  } catch (error) {
    next(error);
  }
};

export const deleteHandler = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const parsedData: DeleteBusiness = deleteBusinessSchema.parse(req.body);
    const result = await deleteBusiness(parsedData);
    return successResponse(res, 200, "Deleted successful", result);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const findAllHandler = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await getAllBusinessExpense();
    return successResponse(res, 200, "Business fetched successful", result);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

