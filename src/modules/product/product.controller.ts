// costumer
// src/modules/auth/auth.controller.ts

import { Response, NextFunction } from 'express';
import {
  CreateProduct,
  createProductSchema,
  UpdateProduct,
  updateProductSchema,
  deleteProductSchema,
  GetProduct,
  getProductSchema,
} from './product.validators';
import { successResponse } from '../../utils/response';
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  updateProduct,
} from './product.service';
import { AuthRequest } from '../../middleware/auth.middleware';

export const createHandler = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const parsedData: CreateProduct = createProductSchema.parse({ ...req.body, createdBy: (req.user as any)?.id });
    const result = await createProduct(parsedData);
    return successResponse(res, 201, 'Product created successfully', result);
  } catch (error) {
    next(error);
  }
};

export const updateHandler = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const parsedData: UpdateProduct = updateProductSchema.parse(req.body);
    const result = await updateProduct(parsedData);
    return successResponse(res, 200, 'Update successful', result);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const deleteHandler = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const parsedData: UpdateProduct = deleteProductSchema.parse(req.body);
    const result = await deleteProduct(parsedData);
    return successResponse(res, 200, 'Deleted successful', result);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const findAllHandler = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const parsedData: GetProduct = getProductSchema.parse(req.params);
    const result = await getAllProducts(parsedData);
    return successResponse(res, 200, 'Products fetched successful', result);
  } catch (error) {
    console.log(error);
    next(error);
  }
};
