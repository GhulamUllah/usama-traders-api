import { Request, Response, NextFunction } from "express";
import {
  CreateTransaction,
  createTransactionSchema,
  deleteTransactionSchema,
  getAllTransactionsSchema,
  getTransactionByIdSchema,
  getTransactionsSchema,
} from "./transaction.validators";
import { errorResponse, successResponse } from "../../utils/response";
import {
  createTransaction,
  deleteTransaction,
  getAllTransactions,
  getCustomerTransactions,
  getTransactionById,
} from "./transaction.services";
import { AuthRequest } from "../../middleware/auth.middleware";

// ✅ Create Transaction (credit/debit)
export const createHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const parsedData: CreateTransaction = createTransactionSchema.parse(
      req.body,
    );
    const result = await createTransaction(parsedData);
    return successResponse(
      res,
      201,
      "Transaction created successfully",
      result,
    );
  } catch (error) {
    next(error);
  }
};

// ✅ Get transaction by ID
export const getByIdHandler = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const parsedData = getTransactionByIdSchema.parse(req.params);
    const result = await getTransactionById(parsedData, (req as any).user.id);
    if (!result)
      return errorResponse(
        res,
        404,
        "You are not authorized to access this transaction or it does not exist",
      );
    return successResponse(
      res,
      200,
      "Transaction fetched successfully",
      result,
    );
  } catch (error) {
    next(error);
  }
};

// ✅ Get all transactions (admin-level)
export const findAllHandler = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const parsedQuery = getAllTransactionsSchema.parse(req.query);
    const result = await getAllTransactions(
      parsedQuery,
      (req as any).user.role,
      (req as any).user.id,
    );
    return successResponse(
      res,
      200,
      "Transactions fetched successfully",
      result,
    );
  } catch (error) {
    next(error);
  }
};

// ✅ Get transactions of a specific customer
export const findByCustomerHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const parsedData = getTransactionsSchema.parse(req.params);
    const result = await getCustomerTransactions(parsedData);
    return successResponse(
      res,
      200,
      "Customer transactions fetched successfully",
      result,
    );
  } catch (error) {
    next(error);
  }
};

// ✅ Soft delete a transaction
export const deleteHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const parsedData = deleteTransactionSchema.parse(req.body);
    const result = await deleteTransaction(parsedData);
    return successResponse(
      res,
      200,
      "Transaction deleted successfully",
      result,
    );
  } catch (error) {
    next(error);
  }
};
