// costumer
// src/modules/auth/auth.controller.ts

import { Response, NextFunction } from 'express';
import {
  CreateShop,
  createShopSchema,
  UpdateShop,
  updateShopSchema,
  deleteShopSchema,
  DeleteShop,
} from './shop.validators';
import { successResponse } from '../../utils/response';
import {
  createShop,
  deleteShop,
  getAllShops,
  getUserShop,
  updateShop,
} from './shop.service';
import { AuthRequest } from '../../middleware/auth.middleware';

export const createHandler = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const parsedData: CreateShop = createShopSchema.parse({ ...req.body, createdBy: (req.user as any)?.id });
    const result = await createShop(parsedData);
    return successResponse(res, 201, 'Shop created successfully', result);
  } catch (error) {
    next(error);
  }
};

export const updateHandler = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const parsedData: UpdateShop = updateShopSchema.parse(req.body);
    const result = await updateShop(parsedData);
    return successResponse(res, 200, 'Update successful', result);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const deleteHandler = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const parsedData: DeleteShop = deleteShopSchema.parse(req.body);
    const result = await deleteShop(parsedData);
    return successResponse(res, 200, 'Deleted successful', result);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const findAllHandler = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const result = await getAllShops();
    return successResponse(res, 200, 'Shops fetched successful', result);
  } catch (error) {
    console.log(error);
    next(error);
  }
};


export const getUserShopHandler = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const result = await getUserShop(req.user);
    return successResponse(res, 200, 'Shops fetched successful', result);
  } catch (error) {
    console.log(error);
    next(error);
  }
};
