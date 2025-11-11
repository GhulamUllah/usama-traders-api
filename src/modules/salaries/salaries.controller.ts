import { NextFunction, Response } from "express";
import { AuthRequest } from "../../middleware/auth.middleware";
import { successResponse } from "../../utils/response";
import {
  createSalaries,
  deleteSalaries,
  getAllSalariesExpense,
} from "./salaries.service";
import {
  createSalarySchema,
  deleteSalarySchema
} from "./salaries.validators";

export const createHandler = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const parsedData = createSalarySchema.parse(req.body);
    const result = await createSalaries(parsedData, req.user);
    return successResponse(res, 201, "Salaries created successfully", result);
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
    const parsedData = deleteSalarySchema.parse(req.body);
    const result = await deleteSalaries(parsedData);
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
    const result = await getAllSalariesExpense();
    return successResponse(res, 200, "Salaries fetched successful", result);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

