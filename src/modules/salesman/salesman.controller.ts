// customer
// src/modules/auth/auth.controller.ts

import { Request, Response, NextFunction } from "express";
import {
  CreateSalesman,
  createSalesmanSchema,
  UpdateSalesman,
  updateSalesmanSchema,
  deleteSalesmanSchema,
  ResetSalesman,
  resetSalesmanSchema,
  getSalesmanByIdSchema,
} from "./salesman.validators";
import { successResponse } from "../../utils/response";
import {
  createSalesman,
  deleteSalesman,
  getAllSalesman,
  getSalesmanById,
  resetSalesman,
  updateSalesman,
} from "./salesman.service";
import { AuthRequest } from "../../middleware/auth.middleware";

export const createHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const parsedData: CreateSalesman = createSalesmanSchema.parse(req.body);
    const result = await createSalesman(parsedData);
    return successResponse(res, 201, "Customer created successfully", result);
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
    const parsedData: UpdateSalesman = updateSalesmanSchema.parse(req.body);
    const result = await updateSalesman(parsedData, req.user);
    return successResponse(res, 200, "Update successful", result);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const resetHandler = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const parsedData: ResetSalesman = resetSalesmanSchema.parse(req.body);
    const result = await resetSalesman(parsedData, req.user);
    return successResponse(res, 200, "Reset Salesman successful", result);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const deleteHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const parsedData: UpdateSalesman = deleteSalesmanSchema.parse(req.body);
    const result = await deleteSalesman(parsedData);
    return successResponse(res, 200, "Deleted successful", result);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const findAllHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await getAllSalesman();
    return successResponse(res, 200, "Salesman fetched successful", result);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const getByIdHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const parsedData = getSalesmanByIdSchema.parse(req.params)
    const result = await getSalesmanById(parsedData);
    return successResponse(res, 200, "Salesman fetched successful", result);
  } catch (error) {
    console.log(error);
    next(error);
  }
};
