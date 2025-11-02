// customer
// src/modules/auth/auth.controller.ts

import { Request, Response, NextFunction } from "express";
import {
  CreateCustomer,
  createCostumerSchema,
  UpdateCustomer,
  updateCustomerSchema,
  deleteCustomerSchema,
} from "./customer.validators";
import { successResponse } from "../../utils/response";
import {
  createCostumer,
  deleteCustomer,
  getAllCustomers,
  updateCustomer,
} from "./customer.service";

export const createHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const parsedData: CreateCustomer = createCostumerSchema.parse(req.body);
    const result = await createCostumer(parsedData);
    return successResponse(res, 201, "Customer created successfully", result);
  } catch (error) {
    next(error);
  }
};

export const updateHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const parsedData: UpdateCustomer = updateCustomerSchema.parse(req.body);
    const result = await updateCustomer(parsedData);
    return successResponse(res, 200, "Update successful", result);
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
    const parsedData: UpdateCustomer = deleteCustomerSchema.parse(req.body);
    const result = await deleteCustomer(parsedData);
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
    const result = await getAllCustomers();
    return successResponse(res, 200, "Costumers fetched successful", result);
  } catch (error) {
    console.log(error);
    next(error);
  }
};
